import {User, IUser} from '../components/user/user.module';
import { Student, IStudent } from '../components/student/student.module';
import { Department, IDepartment} from '../components/department/department.module';
const request = require('supertest');
const {app} = require('../index');
 
const userOne = {
    username:'sidg5678d',
    password:'skjdkjds',
    role:'admin'
};

const studentOne = {
    name:'siddh kolp',
    phno: 9879225921,
    departmentname: 'it',
    batch:2024,
    currentsem: 7
};

const departmentOne = {
    departmentname:'nano'
};

const batchOne = {
    year: 2026,
    department:"it",
    totalStudentsIntake:600,
    availableSeats:600,
    occupiedSeats:0,
};

describe('Testing of users api',()=>{
 
let token:string;
 
    beforeAll(async() => {
         await request(app).post('/api/user/signup').send(userOne).expect(201);
    }, 8000);
 
    afterAll(async()=>{
        await User.deleteOne({username: userOne.username});
    })
 
    test('login api', async():Promise<void> => {

        const response = await request(app).post('/api/user/login').send({
            username:'sidg5678d',
            password:'skjdkjds'
        }).expect(200);
        token = response.body.token;

    });
    // test('logout api', async(): Promise<void> => {
    //     const response = await request(app)
    //         .post('/api/user/logout')
    //         .set('Authorization', `Bearer ${token}`)
    //         .expect(200); // Ensure the logout was successful
    // });

    describe('student apis', () => {


        test('add student api', async ():Promise<void> => {
           try {
                await request(app).post('/api/students/add-student').set('Authorization',`Bearer ${token}`).send(studentOne).expect(201);
           }catch(error: any){
                throw new Error(error.message);
           }
        });

        test('get all student api', async ():Promise<void> => {
            try {
                await request(app).get('/api/students/all-students').set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('analytic data student api', async ():Promise<void> => {
            try {
                await request(app).get('/api/students/getanalytics').set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('get absent student api', async ():Promise<void> => {
            try {
                const date = '2024-08-22';
                if(!date){
                    throw new Error(`no batch on date data`);
                }
                console.info(`you can alse set query params !`);
                await request(app).get(`/api/students/absent/${date}?batch=&branch=it&currentsem`).set('Authorization',`Bearer ${token}`).expect(200);
                
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('present less than 75 student api', async ():Promise<void> => {
            try {
                await request(app).get(`/api/students/presentlessthan75?batch=&branch=&currentsem=7`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('vacant seats student api', async ():Promise<void> => {
            try {
                await request(app).get(`/api/students/vacantseats?batch=2024&branch=it`).set('Authorization',`Bearer ${token}`).expect(200);    
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('update student api', async ():Promise<void> => {
            try{
                const id = await Student.findOne({name:studentOne.name},{_id:1});
                await request(app).put(`/api/students/update-student/${id?._id}`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('delete by id student api', async ():Promise<void> => {
           try{
            const id = await Student.findOne({name:studentOne.name},{_id:1});
            await request(app).delete(`/api/students/delete-student/${id?._id}`).set('Authorization',`Bearer ${token}`).expect(200);
           }catch(error: any){
            throw new Error(error.message);
        }
        });

        //* this particular test case is working but if u run it will clear whole database
        // test('delete all student api', async ():Promise<void> => {
        //     try {
        //         await request(app).delete(`/api/students/deleteall-students`).set('Authorization',`Bearer ${token}`).expect(200);
        //     }catch(error: any){
        //         throw new Error(error.message);
        //     }
        // });
    });

    describe('department apis', () => {

        test('add department', async(): Promise<void> => {
            try {
                await request(app).post(`/api/departments/add-department`).set('Authorization',`Bearer ${token}`).send(departmentOne).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('get all department', async(): Promise<void> => {
            try {
                await request(app).get(`/api/departments/all-department`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('update department', async(): Promise<void> => {
            try {
                const id = await Department.findOne({departmentname:departmentOne.departmentname},{_id:1});
                await request(app).put(`/api/departments/update-department/${id?._id}`).set('Authorization',`Bearer ${token}`).expect(200);    
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('delete by id department', async(): Promise<void> => {
            try {
                const id = await Department.findOne({departmentname:departmentOne.departmentname},{_id:1});
                await request(app).delete(`/api/departments/delete-department/${id?._id}`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });
    });

    describe('Batch Api', ()=>{

        test('add batch', async(): Promise<void> => {
            try{
                await request(app).post(`/api/batch/add-batch`).set('Authorization',`Bearer ${token}`).send(batchOne).expect(200);
            }catch(error: any){
                console.error(error.message);
                throw new Error(error.message);
            }
        });

        test('get all batch', async(): Promise<void> => {
            try{
                await request(app).get(`/api/batch/get-allbatch`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }   
        });

    });

    describe('attendance api', () => {

        beforeAll(async()=>{
            await request(app).post('/api/students/add-student').set('Authorization',`Bearer ${token}`).send(studentOne).expect(201);
        }, 8000);

        afterAll(async()=>{
            await Student.deleteOne({name:studentOne.name});
        });

        test('add attendance', async(): Promise<void> => {
            try{
                const id = await Student.findOne({name: studentOne.name},{_id:1});
                await request(app).post(`/api/attendance/add-attendance/${id?._id}`).set('Authorization',`Bearer ${token}`).send({isPresent: true}).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('get all attendance', async(): Promise<void> => {
            try{
                await request(app).get(`/api/attendance/all-attendance`).set('Authorization',`Bearer ${token}`).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });

        test('update attendance', async(): Promise<void> => {
            try{
                const date = '2024-08-22';
                if(!date){
                    throw new Error(`no deate exist in database`);
                }
                const id = await Student.findOne({name: studentOne.name},{_id:1});
                await request(app).put(`/api/attendance/update-attendance/${id}/${date}`).set('Authorization',`Bearer ${token}`).send({isPresent: true}).expect(200);
            }catch(error: any){
                throw new Error(error.message);
            }
        });
    });
    
});