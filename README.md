## Start server

```node app/server.js```
## API Examples

### 1. http://localhost:8080/api/signup
#### Headers:
```
null
```
#### Body:
```
{
    "username": "admin",
    "password": "admin",
    "email": "admin@gmail.com"
}
```

___NOTE___: Sau đó đổi giá trị role trong database từ 2 sang 4 (quyền admin)

=> __Response__: 
```
{
  message: "New account created for user: admin"
}
```

### 2. http://localhost:8080/api/authenticate
#### Headers:
```
null
```
#### Body:
```
{
    "username": "admin",
    "password": "admin"
}
```

=> __Response__: 
```
{
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTc1OTg3ODM1LCJleHAiOjE1NzU5ODk2MzV9.7aveV4z_518rfgODfZgeBzIJjH18Bv4GcYZ4HpA1ThI",
    "role": 4
}
```

### 3. http://localhost:8080/api/student/create
#### Headers:
```
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTc1OTg3ODM1LCJleHAiOjE1NzU5ODk2MzV9.7aveV4z_518rfgODfZgeBzIJjH18Bv4GcYZ4HpA1ThI
```
#### Body:
```
{
    "student_id": "17012350",
    "name": "Tuấn",
    "email": "tuan@gmail.com",
    "gender": "Nam",
    "phone_number": "1234567890",
    "class": "CA-CLC1",
    "date_birth": "31-08-1999"
}
```

=> __Response__: 
```
{
    "message": "Student 17012350 created!"
}
```

### 4. http://localhost:8080/api/authenticate
#### Headers:
```
null
```
#### Body:
```
{
  "username": "17012350",
  "password": "31081999"
}
```

=> __Response__: 
```
{
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE3MDEyMzUwIiwiaWF0IjoxNTc1OTg4MDQ1LCJleHAiOjE1NzU5ODk4NDV9.CwqF-DZLQwzkuj0lhick2yafOJ-UYlUeQj8NXgpV6oM",
    "role": 2
}
```

