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


