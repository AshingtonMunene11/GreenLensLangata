def test_get_polygons(test_client):
    """Should return all polygons."""
    response = test_client.get('/polygons')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

