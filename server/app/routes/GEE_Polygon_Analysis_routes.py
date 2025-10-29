from flask import Blueprint, jsonify, request
from flask_cors import CORS
from app import db
from app.models import DevelopmentPlan, PolygonAnalysis, Polygon, User
import ee
import re
import os
import json
from dotenv import load_dotenv

load_dotenv()

gee_bp = Blueprint("gee", __name__)

ee_initialized = False


def init_ee():
    """
    Initialize Google Earth Engine with service account credentials.
    
    This function tries multiple methods to authenticate:
    1. Environment variable with full JSON (GOOGLE_APPLICATION_CREDENTIALS_JSON)
    2. Separate service account email and private key (GEE_SERVICE_ACCOUNT + GEE_PRIVATE_KEY)
    3. Local file path (GOOGLE_APPLICATION_CREDENTIALS)
    
    Returns:
        bool: True if initialization successful, False otherwise
    """
    global ee_initialized
    
    # Skip if already initialized
    if ee_initialized:
        print("✅ Earth Engine already initialized")
        return True

    print("=" * 60)
    print("🔄 Starting Earth Engine initialization...")
    print("=" * 60)

    # METHOD 1: Try full JSON from environment variable (RECOMMENDED FOR RENDER)
    try:
        print("\n📋 Method 1: Checking for GOOGLE_APPLICATION_CREDENTIALS_JSON...")
        credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        
        if credentials_json:
            print(f"✅ Found GOOGLE_APPLICATION_CREDENTIALS_JSON")
            print(f"📏 JSON length: {len(credentials_json)} characters")
            
            # Validate JSON format
            try:
                service_account_info = json.loads(credentials_json)
                print("✅ JSON parsed successfully")
            except json.JSONDecodeError as e:
                print(f"❌ Invalid JSON format: {e}")
                raise
            
            # Extract required fields
            service_account = service_account_info.get("client_email")
            project_id = service_account_info.get("project_id")
            
            if not service_account:
                print("❌ Missing 'client_email' in JSON")
                raise ValueError("client_email not found in credentials")
            
            if not project_id:
                print("⚠️  Warning: 'project_id' not found in JSON, using default")
                project_id = "serene-lotus-475317-i6"
            
            print(f"👤 Service Account: {service_account}")
            print(f"🎯 Project ID: {project_id}")
            
            # Create credentials and initialize
            print("🔐 Creating service account credentials...")
            creds = ee.ServiceAccountCredentials(service_account, key_data=credentials_json)
            
            print("🚀 Initializing Earth Engine...")
            ee.Initialize(credentials=creds, project=project_id, opt_url='https://earthengine.googleapis.com')
            
            ee_initialized = True
            print("=" * 60)
            print("✅ SUCCESS: Earth Engine initialized with full JSON!")
            print("=" * 60)
            return True
        else:
            print("⚠️  GOOGLE_APPLICATION_CREDENTIALS_JSON not found")
            
    except Exception as e:
        print(f"❌ Method 1 failed: {e}")
        import traceback
        traceback.print_exc()

    # METHOD 2: Try separate service account and private key
    try:
        print("\n📋 Method 2: Checking for GEE_SERVICE_ACCOUNT + GEE_PRIVATE_KEY...")
        service_account = os.getenv("GEE_SERVICE_ACCOUNT")
        private_key_json = os.getenv("GEE_PRIVATE_KEY")

        if service_account and private_key_json:
            print(f"✅ Found GEE_SERVICE_ACCOUNT: {service_account}")
            print(f"✅ Found GEE_PRIVATE_KEY (length: {len(private_key_json)} chars)")
            
            # Parse the private key JSON
            try:
                key_data = json.loads(private_key_json)
                print("✅ Private key JSON parsed successfully")
            except json.JSONDecodeError as e:
                print(f"❌ Invalid private key JSON: {e}")
                raise

            # Create credentials and initialize
            print("🔐 Creating service account credentials...")
            creds = ee.ServiceAccountCredentials(service_account, key_data=key_data)
            
            print("🚀 Initializing Earth Engine...")
            ee.Initialize(creds, project="serene-lotus-475317-i6")
            
            ee_initialized = True
            print("=" * 60)
            print("✅ SUCCESS: Earth Engine initialized with separate credentials!")
            print("=" * 60)
            return True
        else:
            if not service_account:
                print("⚠️  GEE_SERVICE_ACCOUNT not found")
            if not private_key_json:
                print("⚠️  GEE_PRIVATE_KEY not found")
                
    except Exception as e:
        print(f"❌ Method 2 failed: {e}")
        import traceback
        traceback.print_exc()

    # METHOD 3: Try local file path (for development)
    try:
        print("\n📋 Method 3: Checking for GOOGLE_APPLICATION_CREDENTIALS file path...")
        key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        if key_path:
            print(f"✅ Found GOOGLE_APPLICATION_CREDENTIALS: {key_path}")
            
            if not os.path.exists(key_path):
                print(f"❌ File does not exist at path: {key_path}")
                raise FileNotFoundError(f"Credentials file not found at {key_path}")
            
            print(f"✅ File exists at {key_path}")
            
            # Read and parse the JSON file
            with open(key_path) as f:
                service_account_info = json.load(f)
                service_account = service_account_info["client_email"]
                project_id = service_account_info.get("project_id", "serene-lotus-475317-i6")

            print(f"👤 Service Account: {service_account}")
            print(f"🎯 Project ID: {project_id}")
            
            # Create credentials and initialize
            print("🔐 Creating service account credentials from file...")
            creds = ee.ServiceAccountCredentials(service_account, key_path)
            
            print("🚀 Initializing Earth Engine...")
            ee.Initialize(credentials=creds, project=project_id)
            
            ee_initialized = True
            print("=" * 60)
            print("✅ SUCCESS: Earth Engine initialized from local file!")
            print("=" * 60)
            return True
        else:
            print("⚠️  GOOGLE_APPLICATION_CREDENTIALS not found")
            
    except Exception as e:
        print(f"❌ Method 3 failed: {e}")
        import traceback
        traceback.print_exc()

    # ALL METHODS FAILED
    print("\n" + "=" * 60)
    print("❌ FAILURE: All initialization methods failed!")
    print("=" * 60)
    print("\n📝 Troubleshooting Steps:")
    print("1. Go to Render Dashboard → Your Service → Environment")
    print("2. Add environment variable:")
    print("   Key: GOOGLE_APPLICATION_CREDENTIALS_JSON")
    print("   Value: <paste your entire service account JSON>")
    print("\n3. The JSON should look like:")
    print('   {"type":"service_account","project_id":"...","private_key":"...","client_email":"...",...}')
    print("\n4. Make sure Earth Engine API is enabled in Google Cloud Console")
    print("5. Verify service account has 'Earth Engine Resource Writer' role")
    print("=" * 60)
    
    return False


@gee_bp.route("/test", methods=["GET"])
def test_gee_connection():
    """
    Test endpoint to verify Google Earth Engine authentication and access.
    
    This endpoint:
    1. Attempts to initialize Earth Engine
    2. Loads a sample dataset (SRTM elevation data)
    3. Returns dataset information if successful
    
    Returns:
        JSON: Success status with dataset info, or error message
    """
    print("\n" + "🔍" * 30)
    print("Testing GEE Connection...")
    print("🔍" * 30)
    
    try:
        # Try to initialize Earth Engine
        if not init_ee():
            print("❌ Test failed: Earth Engine not initialized")
            return jsonify({
                "status": "error", 
                "message": "Earth Engine not initialized. Check server logs for details."
            }), 500

        print("✅ Earth Engine initialized, fetching test dataset...")
        
        # Try to access a sample dataset
        image = ee.Image("USGS/SRTMGL1_003")
        print("✅ Dataset loaded, getting info...")
        
        info = image.getInfo()
        print("✅ Dataset info retrieved successfully!")

        return jsonify({
            "status": "success",
            "message": "Earth Engine connected successfully ✅",
            "sample_band_keys": list(info.get("bands", [])),
            "dataset": info.get("id", "N/A")
        }), 200

    except Exception as e:
        print(f"❌ GEE test error: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            "status": "error",
            "message": str(e),
            "hint": "Check if Earth Engine API is enabled and service account has proper permissions"
        }), 500


@gee_bp.before_request
def ensure_ee_initialized():
    """
    Middleware to ensure Earth Engine is initialized before processing requests.
    
    This runs before every request to routes in this blueprint.
    - Skips initialization for OPTIONS requests (CORS preflight)
    - Returns 500 error if initialization fails
    """
    if request.method == "OPTIONS":
        print("⏭️  Skipping EE init for CORS preflight (OPTIONS request)")
        return
    
    print(f"\n📨 Incoming request: {request.method} {request.path}")
    
    if not init_ee():
        print("❌ Request blocked: Earth Engine not initialized")
        return jsonify({
            "error": "Failed to initialize Earth Engine❌",
            "hint": "Check server logs and verify GOOGLE_APPLICATION_CREDENTIALS_JSON is set in Render"
        }), 500
    
    print("✅ Earth Engine ready, processing request...")


def wkt_to_coords(wkt_str):
    """
    Convert WKT (Well-Known Text) polygon string to coordinate list.
    
    Args:
        wkt_str: String in format "POLYGON((lon1 lat1, lon2 lat2, ...))"
    
    Returns:
        list: Nested list of coordinates [[lon, lat], [lon, lat], ...]
    """
    print(f"🗺️  Converting WKT to coordinates...")
    
    if not wkt_str.startswith("POLYGON(("):
        print(f"❌ Invalid WKT format: {wkt_str[:50]}...")
        raise ValueError("Invalid WKT format - must start with 'POLYGON(('")

    coords_str = re.search(r"\(\((.*)\)\)", wkt_str).group(1)
    coords = []

    for pair in coords_str.split(","):
        lon, lat = map(float, pair.strip().split())
        coords.append([lon, lat])

    print(f"✅ Converted {len(coords)} coordinate pairs")
    return [coords]


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["GET"])
def get_analysis(plan_id):
    """
    Retrieve saved analysis results for a development plan.
    
    Args:
        plan_id: ID of the development plan
    
    Returns:
        JSON: Analysis results or error message
    """
    print(f"\n📊 Fetching analysis for plan ID: {plan_id}")
    
    try:
        analysis = PolygonAnalysis.query.filter_by(
            development_plan_id=plan_id).first()

        if not analysis:
            print(f"❌ No analysis found for plan {plan_id}")
            return jsonify({"error": "No analysis found for this plan"}), 404

        print(f"✅ Analysis found: {analysis.status}")
        return jsonify(analysis.to_dict()), 200

    except Exception as e:
        print(f"❌ Error fetching analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@gee_bp.route("/development_plans/<int:plan_id>/analyze", methods=["POST"])
def analyze_plan(plan_id):
    """
    Run Earth Engine analysis and save results for a development plan.
    
    This endpoint:
    1. Validates user authentication
    2. Fetches the development plan and polygon
    3. Analyzes land cover using Google Earth Engine
    4. Calculates environmental impact metrics
    5. Determines pass/fail status
    6. Saves results to database
    
    Args:
        plan_id: ID of the development plan
    
    Request Body:
        user_id: ID of the user requesting analysis
    
    Returns:
        JSON: Analysis results with recommendations
    """
    print(f"\n🔬 Starting analysis for plan ID: {plan_id}")
    print("=" * 60)

    # STEP 1: Validate user
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        print("❌ Missing user_id in request")
        return jsonify({"error": "user_id is required"}), 400
    
    print(f"👤 User ID: {user_id}")

    # STEP 2: Fetch development plan
    print(f"📋 Fetching development plan {plan_id}...")
    plan = DevelopmentPlan.query.get(plan_id)
    
    if not plan:
        print(f"❌ Plan {plan_id} not found in database")
        return jsonify({"error": "Plan not found"}), 404
    
    print(f"✅ Plan found: {plan.type}, Area: {plan.area_size} km²")

    try:
        # STEP 3: Get polygon geometry
        print(f"🗺️  Fetching polygon geometry...")
        polygon = plan.polygon
        print(f"✅ Polygon ID: {polygon.id}")

        # STEP 4: Convert WKT to Earth Engine geometry
        try:
            coords_list = wkt_to_coords(polygon.coordinates)
            geom = ee.Geometry.Polygon(coords_list)
            print("✅ Earth Engine geometry created")
        except Exception as e:
            print(f"❌ Invalid WKT: {polygon.coordinates[:100]}...")
            print(f"❌ Error: {e}")
            return jsonify({"error": "Invalid polygon geometry"}), 400

        # STEP 5: Load and clip Earth Engine imagery
        print("🛰️  Loading ESA WorldCover dataset...")
        image = ee.ImageCollection("ESA/WorldCover/v100").first().select("Map")
        
        print("✂️  Clipping image to polygon...")
        clipped = image.clip(geom)
        
        # STEP 6: Calculate land cover statistics
        print("📊 Calculating land cover statistics...")
        stats = clipped.reduceRegion(
            reducer=ee.Reducer.frequencyHistogram(),
            geometry=geom,
            scale=50,
            maxPixels=1e13
        )

        print("⬇️  Downloading statistics from Earth Engine...")
        hist = ee.Dictionary(stats.get("Map")).getInfo()
        print(f"✅ Got histogram with {len(hist)} land cover classes")
        
        # STEP 7: Calculate percentages
        total_pixels = sum(hist.values())
        built_up_pct = round(hist.get("50", 0) / total_pixels * 100, 2)
        flora_pct = round(hist.get("10", 0) / total_pixels * 100, 2)
        
        print(f"🏗️  Built-up area: {built_up_pct}%")
        print(f"🌳 Flora/vegetation: {flora_pct}%")

        plan_area = plan.area_size

        # STEP 8: Calculate impact areas
        print("🧮 Calculating environmental impact...")
        built_up_area = plan_area * (built_up_pct/100)
        flora_area = plan_area * (flora_pct/100)
        flora_loss_area = flora_area

        # Calculate polygon area and impacts
        polygon_area_ee = geom.area().divide(1e6).getInfo()
        print(f"📏 Polygon area: {polygon_area_ee:.2f} km²")
        
        total_flora_in_polygon = polygon_area_ee * (flora_pct / 100)
        flora_loss_pct = (flora_loss_area / total_flora_in_polygon * 100) if total_flora_in_polygon > 0 else 0

        total_built_up_in_polygon = polygon_area_ee * (built_up_pct / 100)
        new_built_up_area = total_built_up_in_polygon + plan_area
        new_built_up_pct = (new_built_up_area / polygon_area_ee * 100)
        
        print(f"🌿 Flora loss: {flora_loss_pct:.2f}%")
        print(f"🏙️  New built-up percentage: {new_built_up_pct:.2f}%")

        # STEP 9: Determine pass/fail status
        print("🎯 Determining approval status...")
        if flora_loss_pct <= 10 and new_built_up_pct <= 60:
            status = "Pass"
            print("✅ Status: PASS (Low impact)")
        elif flora_loss_pct <= 20 and new_built_up_pct <= 70:
            status = "Pass"
            print("✅ Status: PASS (Moderate impact)")
        else:
            status = "Fail"
            print("❌ Status: FAIL (High impact)")

        # STEP 10: Save analysis to database
        print("💾 Saving analysis to database...")
        analysis = PolygonAnalysis(
            development_plan_id=plan.id,
            polygon_id=plan.polygon_id,
            built_up_area=built_up_area,
            flora_area=flora_area,
            built_up_pct=built_up_pct,
            flora_pct=flora_pct,
            flora_loss_pct=flora_loss_pct,
            new_built_up_pct=new_built_up_pct,
            status=status,
            user_id=user_id
        )

        plan.status = status

        db.session.add(analysis)
        db.session.commit()
        print("✅ Analysis saved successfully!")

        # STEP 11: Prepare response
        result = analysis.to_dict()
        result.update({
            'status': status,
            'polygon_area': round(polygon_area_ee, 4),
            'plan_area': plan_area,
            'flora_loss_area': round(flora_loss_area, 4),
            'flora_loss_pct': round(flora_loss_pct, 2),
            'new_built_up_pct': round(new_built_up_pct, 2),
            'recommendation': get_recommendation(
                plan.type,
                flora_pct,
                flora_loss_pct,
                new_built_up_pct
            )
        })

        print("=" * 60)
        print("✅ Analysis complete!")
        print("=" * 60)
        
        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error running GEE analysis: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def get_recommendation(plan_type, current_flora_pct, flora_loss_pct, new_built_up_pct):
    """
    Generate recommendation based on environmental impact metrics.
    
    Args:
        plan_type: Type of development (residential, commercial, etc.)
        current_flora_pct: Current vegetation percentage
        flora_loss_pct: Percentage of flora that will be lost
        new_built_up_pct: Projected built-up percentage after development
    
    Returns:
        str: Recommendation message
    """
    if flora_loss_pct > 20:
        return f"⚠️ High impact: This {plan_type} development will destroy {flora_loss_pct:.1f}% of the polygon's flora. Consider reducing your project size."
    elif new_built_up_pct > 70:
        return f"⚠️ Over-development: Polygon will be {new_built_up_pct:.1f}% built-up. Consider alternative locations."
    elif flora_loss_pct <= 10:
        return f"✅ Low impact: Minimal environmental impact ({flora_loss_pct:.1f}% flora loss)."
    else:
        return f"⚠️ Moderate impact: {flora_loss_pct:.1f}% flora loss. Implement mitigation measures."