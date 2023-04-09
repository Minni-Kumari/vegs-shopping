import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { InputGroup, Form, Button, Table } from 'react-bootstrap'
const HomePage = () => {

    console.log(process.env)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [rating , setRating]=useState('')
    const [isUpdate, setIsUpdate] = useState(false)
    const [id, setId] = useState(null)
    const [data , setData]=useState([])
    const [isLoading, setLoading] = useState(false)
    const handleNameChange = (e) => {
        setName(e.target.value)

    }
    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }
    const handleRatingChange = (e) => {
        setRating(e.target.value)
    }
    const postApi = async(n,p,r)=>{
        try{
            let output = await axios({
                method:'POST',
                url:'http://localhost:8000/api/v1/vegs',
                data :{
                    name:n,
                    price:p,
                    rating:r
                }
            })
            if (output.data.status === 'success')fetchApi()
        }catch(error){
            console.error({error})
        }
    }
    const handleAdd = () => {
        if (name === '' || price ===''|| rating === ''){window.alert('Please enter the data')}
        postApi(name,price,rating);
        setName('')
        setPrice('')
        setRating('')
    }
    const deleteApi = async(id)=>{
        try{
            let output = await axios({
                method:'DELETE',
                url :`http://localhost:8000/api/v1/vegs/${id}`,
            })

            if(output.data.status === 'success') fetchApi()
            console.log({output})
        }catch(error){
            console.log({error})
        }
    }
    const handleDelete = (id) => {
       if(window.confirm('Are you sure you want to delete the data')){
        deleteApi(id);
       }else{
        return false;
       }
    }
    const handleEdit = (n, p,r,id) => {
        debugger
        setIsUpdate(true)
        setId(id)
        setName(n)
        setPrice(p)
        setRating(r)

    }
    const updateApi = async(n,p,r,_id)=>{
        try{
            const output = await axios({
                method:'PUT',
                url : `http://localhost:8000/api/v1/vegs/${_id}`,
                data :{
                    name:n,
                    price:p,
                    rating:r
                }
            })
            if(output.data.status === 'success') fetchApi()
        }catch(error){
            console.log({error})
        }
    }
    const handleUpdate = () => {
        updateApi(name,price,rating,id)
        setIsUpdate(false)
        setName('')
        setPrice('')
        setRating('')
    }
    const fetchApi = async()=>{
        setLoading(true)
        try{
            let output = await axios({
                method: 'GET',
                url :'http://localhost:8000/api/v1/vegs'
            })
            output = output.data
            setData(output.vegs)
            setLoading(false)
            
        }catch(error){
            console.log({error})
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchApi()
    },[])
    return (
        <div style={{ width: '500px', margin: 'auto' }}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter name"
                />
                <Form.Control
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="Enter Price"
                />
                <Form.Control
                    value={rating}
                    onChange={handleRatingChange}
                    placeholder="Enter Rating"
                />
                {
                    isUpdate ? <Button onClick={handleUpdate}>Update</Button> :
                        <Button onClick={handleAdd}>Add</Button>
                }
                {/* <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text> */}
            </InputGroup>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (isLoading && (<span>Loading...</span>))||(
                        data?.map((e, i) => {
                            return (
                                <tr key={i + 1}>
                                    <td>{i + 1}</td>
                                    <td>{e.name}</td>
                                    <td>{e.price}</td>
                                    <td>{e.rating}</td>
                                    <td>
                                        <button onClick={() => handleEdit(e.name,e.price,e.rating,e._id)}>Edit</button>
                                        <button onClick={()=>handleDelete(e._id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                        )
                    }
                </tbody>
            </Table>
        </div>
    )
}
export default HomePage;