import React, { Component } from 'react';
import axios from 'axios';

import styles from './PokemonList.css';
import logo from '../pokemon/logo.png';
import PokemonCard from './PokemonCard';

export default class PokemonList extends Component {
  state = {
    url: 'https://pokeapi.co/api/v2/pokemon/',
    pokemon: null,
    search: null,
  };

  async componentDidMount() {
    const res = await axios.get(this.state.url);
    this.setState({ pokemon: res.data['results'] });
  }

  onchange = (e) => {
    this.setState({ search: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div className='row'>
          <nav className='navbar navbar-expand-md navbar-dark bg-dark fixed-top'>
            <div style={{ display: 'flex' }}>
              <img
                src={logo}
                className='pokemonLogo'
                style={{ width: '30px', height: '30px' }}
              />
              <a
                href=''
                className='navbar-brand col-sm-3 col-md-2 mr-0 align-items-center'
              >
                Pokedex
              </a>
            </div>
            <div className=' ml-auto mr-5'>
              <div className='searchBar' style={{ display: 'flex' }}>
                <button type='submit' className='searchIcon'>
                  <i class='fa fa-search'></i>
                </button>
                <input
                  type='text'
                  placeholder='Search for pokemon'
                  onChange={(e) => this.onchange(e)}
                />
              </div>
            </div>
          </nav>
        </div>

        {this.state.pokemon ? (
          <div className='row'>
            {this.state.pokemon
              .filter((pokemon) => {
                if (this.state.search == null) return pokemon;
                else if (
                  pokemon.name
                    .toLowerCase()
                    .includes(this.state.search.toLowerCase())
                ) {
                  return pokemon;
                }
              })
              .map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  url={pokemon.url}
                />
              ))}
          </div>
        ) : (
          <h3 className='mx-auto'>Loading Pokemon</h3>
        )}
      </React.Fragment>
    );
  }
}
