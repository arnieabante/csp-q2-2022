import React, {useState} from 'react'
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'

let Content = () => {

    let [state, setState] = useState({
            jsonData: {
                json: ''
            },
            outputJson: [],
            isProcessing: false,
            jsonField:'',
            errorMsg:''
    });

    let handleChange = (e) => {
        setState({
            ...state,
            jsonData:{
                ...state.json,
                [e.target.name]:e.target.value
            },
            jsonField:e.target.value

        });
    }

    let Process = (e) => {
        e.preventDefault();
        var data = state.jsonData;

        //Set state of isProcessing to true
        setState({
            outputJson: [],
            isProcessing:true,
            errorMsg: ''
        });

        axios.post(window.api_url + 'api/timberdocking/processJson',  data, {
            headers : {
                'Content-Type': 'application/json',
                'X-Request-With': 'XMLHttpRequest'
            }
        }).then((response) => {
            if(response.data.success === true){
                setState({
                    outputJson:response.data.data,
                    isProcessing:false,
                    errorMsg: '',
                    jsonField:''
                });
            } else {
                setState({
                    outputJson:[],
                    isProcessing:false,
                    errorMsg: response.data.message,
                    jsonField:''
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            setState({
                outputJson:[],
                isProcessing:false
            });
        });
    };

    let ClearFields = (e) => {
        e.preventDefault();
        //Set state of isProcessing to true
        setState({
            outputJson: [],
            isProcessing:false,
            errorMsg:'',
            jsonField:''
        });
    };

    return (
        <>
            <Container className="mt-3">
                <Row>
                    <Col md={3}>
                        <Card className="shadow-lg">    
                            <Card.Header className="p-3" style={{backgroundColor: '#087A46'}}>
                                <h5 style={{color:'white'}}>JSON</h5>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Form.Group>
                                        <Form.Control type="text" name="json" value={state.jsonField} placeholder="Paste your JSON text here..." onChange={handleChange}/>
                                    </Form.Group>
                                </Form>
                                <Button variant="success" type="submit" className="mt-3 m-3" onClick={Process}>Process</Button>
                                <Button variant="warning" onClick={ClearFields}>Clear</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card className="shadow-lg">    
                            <Card.Header className="p-3" style={{backgroundColor: '#087A46'}}>
                                <h5 style={{color:'white'}}>Ouput</h5>
                            </Card.Header>
                            <Card.Body>
                                <Tabs defaultActiveKey="table" className='mb-3'>
                                    <Tab eventKey="table" title="Tabular Format">
                                        <Row>
                                            <Col md={12}>
                                                <Table stripped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Transaction No.</th>
                                                            <th>Transformation</th>
                                                            <th>Balance</th>
                                                            <th>Is Valid</th>
                                                             <th>Error Reason</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            state.outputJson.length > 0  &&
                                                            state.outputJson.map(output=>{
                                                                return (
                                                                    <tr key={output.transaction}>
                                                                        <td>{output.transaction}</td>
                                                                        <td>
                                                                            {JSON.stringify(output.transformation)}
                                                                        </td>
                                                                        <td>{output.balance.toFixed(2)}</td>
                                                                        <td>{output.isValid?'true':'false'}</td>
                                                                        <td>{output.errorReason===null?'null':output.errorReason}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            state.outputJson.length === 0?
                                                                <tr>
                                                                    {state.isProcessing===true?
                                                                    <td colSpan = "5" className='text-center'><Spinner animation="border"/></td>:
                                                                    <td colSpan = "5" className='text-center'>No records found.</td>
                                                                    }
                                                                </tr>
                                                            :''
                                                        }
                                                    </tbody>

                                                </Table>
                                            </Col>
                                        </Row>
                                    </Tab>
                                    <Tab eventKey="json" title="JSON Format">
                                        {state.outputJson.length === 0?'':JSON.stringify(state.outputJson)}
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                        {state.errorMsg === ''?'':
                            <Alert key="danger" variant="danger" className="mt-3">
                                {state.errorMsg}
                            </Alert>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Content