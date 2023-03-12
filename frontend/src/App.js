//StAuth10244: I Nicholas Milanovic, 000292701 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import './App.css';
import * as React from "react";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
// Importing react router
import {Routes, Route, NavLink, Link, useParams, Outlet, BrowserRouter} from "react-router-dom";
import logoReal from "./logoReal.jpg";

// Material UI is included in the install of the front end, so we have access
// to components like Buttons, etc, when we import them.

function Pets() {
  
  // isLoaded keeps track of whether the initial load of pet data from the
  // server has occurred.  pets is the array of pets data in the table, and 
  // searchResults is the array of pets data after a search request.
  // showAddPet displays new pet added after an add request
  const [isLoaded, setIsLoaded] = useState(false);
  const [pets, setPets] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddPet, setShowAddPet] = useState(false);

  // fetches all pet data from the server
  function fetchPets()
  {
    fetch("http://localhost:3001/api?act=getall")
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoaded(true);
        setPets(result);
      })    
  }
  
  // use fetchPets as an effect with an empty array as a 2nd argument, which 
  // means fetchPets will ONLY be called when the component first mounts
  useEffect(fetchPets, []);

  // uses the click event of the submit form created when adding a new pet.
  // saves the input by the user into variables we will use later, and removes
  // the form from the page once submitted
  function submitForm(event) {
    event.preventDefault();
    const animal = document.getElementById('animal').value;
    const description = document.getElementById('description').value;
    const age = document.getElementById('age').value;
    const price = document.getElementById('price').value;
    addPet(animal, description, age, price);
    setShowAddPet(false);
  }
  
  // Inserts a pet with hardcoded data in the URL for each query parameter, we 
  // could insert a pet with custom data by building a string like this:
  //
  // let url = "http://localhost:3001/api?act=add&animal=" + animal + ...
  //
  // fetch(url)
  // .then( ... )...
  //

  // using the variables saved from the input values, the add request is made to the backend, and a 
  // new array setPets copy's the previous pets array plus the result of the request to the backend
  function addPet(animal, description, age, price) {
    fetch(`http://localhost:3001/api?act=add&animal=${animal}&description=${description}&age=${age}&price=${price}`)
      .then(res => res.json())
      .then(result => {
        fetchPets();
        setPets(prevPets => [...prevPets, result]); // append the new pet to the existing pets array
      });
  }

  // Deletes a pet from the pet inventory, using a hardcoded id query parameter
  // Again we could delete a pet with custom data by building a string like:
  //
  // let url = "http://localhost:3001/api?act=delete&id=" + id
  //
  // fetch(url)
  // .then( ... )...
  //
  // 
  function deletePet(id) {
    let url = `http://localhost:3001/api?act=delete&id=${id}`;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        fetchPets();
      });
  }

  // Updates a pet in the pet inventory.  Again we use hardcoded data but 
  // could build a custom fetch URL string.

  // Iterating through the setPets array to find a match in id with the pet that
  // was clicked, when found, set pet.edit to true
  function editPet(id) {
    setPets(
      pets.map((pet) => {
        if (pet.id === id) {
          pet.edit = true;
        }
        return pet;
      })
    );
  }
  
  // Any changes that are made in the edit will be stored in each respective attribute 
  // which happen once the user clicks Save. The updatePet function gets called to make an
  // update request to the server
  function savePet(id) {
    setPets(
      pets.map((pet) => {
        if (pet.id === id) {
          pet.edit = false;
          pet.animal = document.getElementById(`animal${id}`).value;
          pet.description = document.getElementById(`description${id}`).value;
          pet.age = parseInt(document.getElementById(`age${id}`).value);
          pet.price = parseFloat(document.getElementById(`price${id}`).value);
          updatePet(pet);
        }
        return pet;
      })
    );
  }

  // Any changes made in the text field get reverted, once the id within the array
  // matches with the id of the pet clicked, pet.edit is false and the pet clicked gets
  // returned with no change.
  function cancelEditPet(id) {
    setPets(
      pets.map((pet) => {
        if (pet.id === id) {
          pet.edit = false;
        }
        return pet;
      })
    );
  }

  // Update request made to the backend to get the most up to date array of pets
  function updatePet(pet) {
    let url = `http://localhost:3001/api?act=update&id=${pet.id}&animal=${pet.animal}&description=${pet.description}&age=${pet.age}&price=${pet.price}`;
    fetch(url).then((res) => res.json()).then((result) => {
      fetchPets();
    });
  }
  
  // Searches for pets in the pet inventory.  Again we use hardcoded data but
  // we could build a custom fetch URL string.
  // function searchPet()
  // {
  //   fetch("http://localhost:3001/api?act=search&term=friendly%20with")
  //   .then(res => res.json())
  //   .then(
  //     (result) => {
  //       setSearchResults(JSON.stringify(result));
  //     });
  // }

  // Home function that will display the logo on the home screen
  function Home() { return ( <img src={logoReal} alt="logo.jpg"/> ); }
  function Inventory() { 

                  // Setting state variables for click events and displaying new
                  // pets added to the table
                  const [clicked, setClicked] = useState(false);
                  const [showAddPet, setShowAddPet] = useState(false);
                  
                  // Change state function to handle a new click event that occured
                  // which display the updated table
                  function handleAddPetClick() {
                    setClicked(true);
                    setShowAddPet(true);
                  }
                  return (
                      <div>
                        <table>
                          <tbody>
                            <tr>
                              <th>Animal</th>
                              <th>Description</th>
                              <th>Age</th>
                              <th>Price</th>
                              <th>Edit/Delete</th>
                            </tr>                            
                            {pets.map((pet) => (
                              <tr key={pet.id}>
                                <td>
                                  {pet.edit ? (
                                    <input type="text" defaultValue={pet.animal} id={`animal${pet.id}`} />
                                  ) : ( pet.animal )}
                                </td>
                                <td>
                                  {pet.edit ? (
                                    <input type="text" defaultValue={pet.description} id={`description${pet.id}`} />
                                  ) : ( pet.description )}
                                </td>
                                <td>
                                  {pet.edit ? (
                                    <input type="number" defaultValue={pet.age} id={`age${pet.id}`} />
                                  ) : ( pet.age )}
                                </td>
                                <td>
                                  {pet.edit ? (
                                    <input type="number" defaultValue={pet.price} id={`price${pet.id}`} />
                                  ) : ( pet.price )}
                                </td>
                                <td>
                                  {pet.edit ? (
                                    <>
                                      <Button variant="contained" onClick={() => savePet(pet.id)}>Save</Button>
                                      &ensp;
                                      <Button variant="contained" onClick={() => cancelEditPet(pet.id)}>Cancel</Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button variant="contained" onClick={() => editPet(pet.id)}>Edit</Button>
                                      &ensp;
                                      <Button variant="contained" onClick={() => deletePet(pet.id)}>Delete</Button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}  
                          </tbody>
                        </table>
                        <br/>
                        <Button variant="contained" onClick={handleAddPetClick}>Add Pet</Button>
                        {showAddPet && 
                          <form onSubmit={submitForm}>
                            <label for="animal">Animal: </label>
                            <input type="text" id="animal" name="animal" required></input>
                            <br/><br/>
                            <label for="description">Description: </label>
                            <input type="text" id="description" name="description" required></input>
                            <br/><br/>
                            <label for="age">Age: </label>
                            <input type="number" id="age" name="age" required></input>
                            <br/><br/>
                            <label for="price">Price: </label>
                            <input type="number" step="0.01" id="price" required></input>
                            <br/><br/>
                            <Button variant="contained" type="submit" onClick={submitForm}>Click To Add</Button>
                          </form>
                        }
                      </div>
                        ); }
  function Search() { 
                    const [searchTerm, setSearchTerm] = useState('');
                    const [searchResults, setSearchResults] = useState([]);
                    const [pets, setPets] = useState([]);
                  
                    function searchPet(searchTerm){
                      fetch(`http://localhost:3001/api?act=search&term=${encodeURIComponent(searchTerm)}`)
                      .then(res => res.json())
                      .then(data => {
                        const filteredResults = data.filter(pet => {
                          return(
                            pet.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            pet.age.toString().includes(searchTerm) ||
                            pet.price.toString().includes(searchTerm)
                          );
                        });
                        setSearchResults(filteredResults);
                      })
                      .catch(error =>{
                        console.log(error);
                      });
                    }

                    const handleSearchInputChange = event => {
                      const value = event.target.value;
                      setSearchTerm(value);
                  
                      if (value === '') {
                        // If the search term is empty, fetch all pets from the backend
                        fetch('http://localhost:3001/api?act=getall')
                          .then(res => res.json())
                          .then(data => setSearchResults(data));
                      } else {
                        // Otherwise, perform the search using the current search term
                        searchPet(value);
                      }
                    };
                  
                    return (
                      <div>
                        <input
                          type="text"
                          placeholder="Search pets..."
                          value={searchTerm}
                          onChange={handleSearchInputChange}
                        />
                        <table id="filteredTable">
                          <thead>
                            <tr>
                              <th>Animal</th>
                              <th>Description</th>
                              <th>Age</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map(pet => (
                              <tr key={pet.id}>
                                <td>{pet.animal}</td>
                                <td>{pet.description}</td>
                                <td>{pet.age}</td>
                                <td>{pet.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
  function About() { return ( <div>
                              <h1>Welcome to the Pet Store!</h1>
                              <br/>
                              <p>Here you can take a look at our inventory, add a pet, edit, remove,
                                & search for specifics! Enjoy our website we hope to hear from you soon.                                  
                              </p>
                              </div> ); }
  

  // If data has loaded, render the table of pets, buttons that execute the 
  // above functions when they are clicked, and a table for search results. 
  // Notice how we can use Material UI components like Button if we import 
  // them as above.
  //

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
          <br/><br/>
          <Button variant="contained" onClick={Home}><NavLink to="/"><strong>Home</strong></NavLink></Button>
          &ensp;
          <Button variant="contained" onClick={Inventory}><NavLink to="/inventory"><strong>Inventory</strong></NavLink></Button>
          &ensp;
          <Button variant="contained" onClick={Search}><NavLink to="/search"><strong>Search</strong></NavLink></Button>
          &ensp;
          <Button variant="contained" onClick={About}><NavLink to="/about"><strong>About</strong></NavLink></Button>
          <br/><br/>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="search" element={<Search />} />
            <Route path="about" element={<About />} />
          </Routes>

      </div>
    );
  }
}



function App() {
  return (
    <BrowserRouter>
      <Pets />
    </BrowserRouter>
  );
}

export default App;
