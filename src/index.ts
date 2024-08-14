import dotenv from 'dotenv';
import { connectionToDb }          from './db-connection/mongodb-connection';
import express from 'express';
dotenv.config();

const connectionUrl: string |            undefined = process.env.MONGODB_URL;
const port: string | undefined = process.env.PORT;

connectionToDb(connectionUrl)

const app =       express();

export         { app, port };
