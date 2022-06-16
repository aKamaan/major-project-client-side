import React from 'react'
import {Button,Form,Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import Hawker from './Hawker'


const Login = (props) => {

    const [messg,setMessg]=useState('');
    const [color,setColor]=useState('');
    const [show,setShow]=useState(0);
    // const navigate = useNavigate();
    // window.location.href='http://localhost:3000/login';
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        const hawker={
            email:e.target[0].value,
            password:e.target[1].value
        }
        fetch('http://localhost:5000/api/hawker/signin', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(hawker)
        }).then(rsp=>rsp.json())
        .then(data=>{
            if(data.error){
                setShow(1);
                setMessg(data.error);
                setColor('danger');
                
            }else{
                setShow(1);
                setMessg('Sucess Login');
                setColor('success');
                localStorage.setItem('user',data.token);
                localStorage.setItem('name',data.user.name.split(' ')[0]);
                window.location.href='http://localhost:5000/hawker';
                window.location.reload();
            }
        });
        
    }
    const renderAlert=()=>{
        if(show){
            return (
                <Alert variant={color} onClose={() => setShow(false)} dismissible>{messg}</Alert>
            );
        }else
            return <div></div>
    }
    if(localStorage.getItem('user')){
        return <Hawker/>
    }else{

        return (
                <div className='login'>
                    {renderAlert()}
                    <h2 className='my-3' style={{color:"blue"}}>Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                            <Form.Text className="text-muted">
                            Forgot Password
                            </Form.Text>
                        </Form.Group>
                      
                        <Button variant="primary" type="submit" className='mx-2'>
                            Login
                        </Button>
                      
                        <Link to='/signup' className='mx-3'>Create an account/Sign up</Link>
                    </Form>
                </div>
        )
    }
}

export default Login