import re
from urllib.parse import urlparse
import os


# Validate required report fields

def validate_report_data(data):
    required_fields = ["title", "description", "location"]
    missing = [field for field in required_fields if not data.get(field)]

    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None


# Validate image URL 
def validate_image_url(url):
    if not url:
        return True, None  
    parsed = urlparse(url)
    if not all([parsed.scheme, parsed.netloc]):
        return False, "Invalid image URL"
    return True, None


#Validate uploaded image file 
def validate_image_file(filename):
    if not filename:
        return True, None  
    allowed_extensions = {"jpg", "jpeg", "png", "gif"}
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    if ext not in allowed_extensions:
        return False, f"Invalid file type: {ext}. Allowed: {', '.join(allowed_extensions)}"
    return True, None
