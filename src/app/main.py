from fastapi import FastAPI
from fastapi_sqlalchemy import DBSessionMiddleware, db
from .decorators import get, ROUTES
from .routes import *


app = FastAPI()
app.add_middleware(DBSessionMiddleware, db_url="postgresql://")

for url, func, arg_class, response_model in ROUTES:
    get(app, url, arg_class, response_model)(func)
