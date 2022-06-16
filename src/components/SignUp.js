import React, { useEffect } from 'react'
import {Button,Form,Alert, Container,Row,Col} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {useState} from 'react'
import Hawker from './Hawker'
import {backendApi} from '../urlConfig'

const SignUp = () => {
    const [show,setShow]=useState(0);
    const [messg,setMessg]=useState('');
    const [color,setColor]=useState('');
    const [lat,setLat]=useState('');
    const [long,setLong]=useState('');
    useEffect(()=>{
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (res)=>{
                    setLat(res.coords.latitude);
                    setLong(res.coords.longitude);
                },(err)=>{
                    setLat('');
                    setLong('');
                }
            )
        } else {
            console.log('location not supprted')
        }
    },[])
    const handleSubmit=(e)=>{
        e.preventDefault();
        const hawker={
            email:e.target[0].value,
            name:e.target[1].value,
            contact:e.target[2].value,
            password:e.target[3].value,
            category:e.target[4].value,
            locality:e.target[5].value,
            city:e.target[6].value,
            lat:lat,
            long:long
        }
        fetch(`${backendApi}/hawker/signup`, {
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
                setColor('danger');
                setMessg(data.error);
            }else{
                setShow(1);
                setColor('primary')
                setMessg(data.message);
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
    if(localStorage.getItem('user'))
        return <Hawker/>
    else{
        return (
                <Container fluid className='login'>
                    {renderAlert()}
                    <h2 className='my-3' style={{color:"blue"}}>SignUp</h2>
                    <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter Name" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        
                            <Form.Group className="mb-3" controlId="formBasicContact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="tel" placeholder="Enter Mobile No." />
                            </Form.Group>
                        </Col>
                        <Col>
                        
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Select aria-label="Default select example" className='mb-3'>
                                    <option value="Fruit Seller">Fruit Seller</option>
                                    <option value="Service Provider">Service Provider</option>
                                    <option value="Vegetable Seller">Vegetable Seller</option>
                                    <option value="Street Food">Street Food</option>
                                    <option value="Ice Cream Seller">Ice Cream Seller</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicLocality">
                                <Form.Label>Locality</Form.Label>
                                <Form.Control type="text" placeholder="Locality" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicDistrict">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" placeholder="City" />
                            </Form.Group>
                        </Col>
                    </Row>
                        <Button variant="primary" type="submit" className='mx-2'>
                            Signup
                        </Button>
                    
                        <Link to='/login' className='mx-3'>Already have an account/Login</Link>
                    </Form>
                </Container>
        )
    }
}

export default SignUp