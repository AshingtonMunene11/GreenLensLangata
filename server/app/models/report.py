from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)             
    description = db.Column(db.Text, nullable=False)              
    location = db.Column(db.String(120), nullable=False)          
    image_url = db.Column(db.String(255), nullable=True)    # Image optional (URl)     
    image_file = db.Column(db.String(255), nullable=True)   # Image optional (file)     
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  #Timestamp
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # Relationship(foreign key)

    def __repr__(self):
        return f"<Report {self.title}>"
