# from app import create_app
# from flask_cors import CORS

# app = create_app()

# CORS(app, origins="http://localhost:3000")  # allow your React frontend
# # CORS(app, resources={r"/*": {"origins": "*"}})

# if __name__ == "__main__":
#     app.run(debug=True)

from app import create_app
from flask_cors import CORS

app = create_app()

# Fix: origins should be a list, and we need to specify methods and headers
CORS(app,
     origins=["https://green-lens-nairobi.vercel.app/".],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

if __name__ == "__main__":
    app.run(debug=True)
