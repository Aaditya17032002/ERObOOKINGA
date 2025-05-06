# Airline Booking System API Documentation

## 1. Overview

This API provides CRUD (Create, Read, Update, Delete) operations for managing users, bookings, and flights within an airline booking system.  It utilizes RESTful principles and JSON for data exchange.

## 2. Available Endpoints

All endpoints are prefixed with `/api/v1/`.

**Users:**

* `/users` (POST) - Create a new user.
* `/users/{user_id}` (GET) - Retrieve a specific user.
* `/users/{user_id}` (PUT) - Update a specific user.
* `/users/{user_id}` (DELETE) - Delete a specific user.

**Flights:**

* `/flights` (GET) - Retrieve a list of flights (with optional query parameters for filtering).
* `/flights/{flight_id}` (GET) - Retrieve a specific flight.  

**Bookings:**

* `/bookings` (POST) - Create a new booking.
* `/bookings/{booking_id}` (GET) - Retrieve a specific booking.
* `/bookings/{booking_id}` (PUT) - Update a specific booking (e.g., change passenger details).
* `/bookings/{booking_id}` (DELETE) - Cancel a specific booking.


## 3. Request/Response Formats

All requests and responses use JSON.

## 4. Field Descriptions

**User:**

| Field       | Type    | Description                               | Required |
|-------------|---------|-------------------------------------------|----------|
| id          | integer | Auto-generated unique identifier           | No       |
| username    | string  | Unique username                         | Yes      |
| password    | string  | Password (hashed and salted)             | Yes      |
| email       | string  | Email address                           | Yes      |
| first_name  | string  | First name                               | Yes      |
| last_name   | string  | Last name                                | Yes      |


**Flight:**

| Field       | Type    | Description                               | Required |
|-------------|---------|-------------------------------------------|----------|
| id          | integer | Auto-generated unique identifier           | No       |
| flight_number | string  | Unique flight number                     | Yes      |
| departure_airport | string  | Departure airport code (e.g., JFK)     | Yes      |
| arrival_airport  | string  | Arrival airport code (e.g., LAX)       | Yes      |
| departure_time | datetime| Departure time                           | Yes      |
| arrival_time  | datetime| Arrival time                             | Yes      |
| available_seats | integer | Number of available seats                | Yes      |


**Booking:**

| Field       | Type    | Description                               | Required |
|-------------|---------|-------------------------------------------|----------|
| id          | integer | Auto-generated unique identifier           | No       |
| user_id     | integer | ID of the user who made the booking      | Yes      |
| flight_id   | integer | ID of the booked flight                  | Yes      |
| passenger_count | integer | Number of passengers                     | Yes      |
| booking_date | datetime| Booking date                              | Yes      |
| total_price | decimal | Total price of the booking               | Yes      |


## 5. Example Requests and Responses

**Example: Create a User (POST /api/v1/users)**

**Request:**

```json
{
  "username": "johndoe",
  "password": "password123",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe" 
}
```

**Example: Get a Flight (GET /api/v1/flights/1)**

**Response (200 OK):**

```json
{
  "id": 1,
  "flight_number": "AA123",
  "departure_airport": "JFK",
  "arrival_airport": "LAX",
  "departure_time": "2024-03-15T14:00:00Z",
  "arrival_time": "2024-03-15T17:00:00Z",
  "available_seats": 150
}
```


## 6. Authentication Requirements

All endpoints except for `/users` (POST) require authentication using JWT (JSON Web Tokens).  A token should be included in the `Authorization` header with the format `Bearer <token>`.  The token is obtained by successfully creating a user account.


## 7. Error Handling

Errors are returned as JSON objects with the following structure:

```json
{
  "error": "Error message",
  "code": "Error code"  //e.g., 404, 400, 500
}
```

Example Error Response (404 Not Found):

```json
{
  "error": "Flight not found",
  "code": 404
}
```

## 8. Rate Limiting Information

The API has a rate limit of 100 requests per minute per IP address.  Exceeding this limit will result in a `429 Too Many Requests` error.  The `Retry-After` header will indicate how long to wait before making further requests.


This documentation provides a basic framework.  More detailed specifications might be needed for complex features or edge cases.  Always refer to the most up-to-date documentation for the most accurate information.
