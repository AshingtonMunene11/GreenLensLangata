import io
from app import db
from app.models import User, Report

def test_create_and_get_report(test_client):
    """Should create a report and retrieve it successfully."""

    # Create a user first
    user = User(username="testuser", email="test@example.com")
    db.session.add(user)
    db.session.commit()

    # Simulate image upload
    image_data = io.BytesIO(b"fake image data")
    image_data.name = "test.jpg"

    response = test_client.post("/reports", data={
        "title": "Blocked Drain",
        "description": "Drainage blocked near market",
        "location": "Langata Market",
        "user_id": user.id,
        "username": user.username
    }, content_type="multipart/form-data", follow_redirects=True)

    assert response.status_code == 201
    data = response.get_json()
    assert data["report"]["title"] == "Blocked Drain"
    assert data["report"]["username"] == "testuser"

    # Get all reports
    get_response = test_client.get("/reports")
    assert get_response.status_code == 200
    reports = get_response.get_json()
    assert isinstance(reports, list)
    assert any(r["title"] == "Blocked Drain" for r in reports)

    # Get single report
    report_id = data["report"]["id"]
    single_response = test_client.get(f"/reports/{report_id}")
    assert single_response.status_code == 200
    single_data = single_response.get_json()
    assert single_data["title"] == "Blocked Drain"


def test_update_and_delete_report(test_client):
    """Should update and delete a report successfully."""

    # Create a user and report
    user = User(username="editor", email="editor@example.com")
    db.session.add(user)
    db.session.commit()

    report = Report(
        title="Old Title",
        description="Old Description",
        location="Old Location",
        user_id=user.id
    )
    db.session.add(report)
    db.session.commit()

    # Update the report
    update_response = test_client.put(f"/reports/{report.id}", data={
        "title": "Updated Title",
        "description": "Updated Description",
        "location": "Updated Location"
    }, content_type="multipart/form-data")

    assert update_response.status_code == 200
    updated = update_response.get_json()["report"]
    assert updated["title"] == "Updated Title"

    # Delete the report
    delete_response = test_client.delete(f"/reports/{report.id}")
    assert delete_response.status_code == 200
    assert delete_response.get_json()["message"] == "Post deleted successfully"
