from datetime import datetime
from app.extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)             
    description = db.Column(db.Text, nullable=False)              
    location = db.Column(db.String(120), nullable=False)          
    image_url = db.Column(db.String(255), nullable=True)    # Image optional (URL)     
    image_file = db.Column(db.String(255), nullable=True)   # Image optional (file)     
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)  # Foreign key
    user = db.relationship("User", backref="reports", lazy=True)

    def __repr__(self):
        return f"<Report {self.title}>"
    
    def to_dict(self):
        
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "image_url": self.image_url,
            "image_file": self.image_file,
            "user_id": self.user_id,
            "username": self.user.username if self.user else "Anonymous",
            "created_at": self.created_at,
        }