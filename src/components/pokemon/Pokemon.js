import React, { Component } from 'react';
import axios from 'axios';

import logo from '../pokemon/logo.png';
import styles from './Pokemon.css';

import { slideInDown } from 'react-animations';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.section`
  background: white;
  box-shadow: 0 1px 14px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 20px;
  height: auto;
  padding-bottom: 2rem;
`;

const TYPE_COLORS = {
  bug: 'B1C12E',
  dark: '4F3A2D',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  fighting: '823551D',
  fire: 'E73B0C',
  flying: 'A3B3F7',
  ghost: '6060B2',
  grass: '74C236',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'C8C4BC',
  poison: '934594',
  psychic: 'ED4882',
  rock: 'B9A156',
  steel: 'B5B5C3',
  water: '3295F6',
};

export default class Pokemon extends Component {
  state = {
    name: '',
    pokemonIndex: '',
    imageUrl: '',
    types: [],
    description: '',
    stats: {
      hp: '',
      attack: '',
      defense: '',
      speed: '',
      specialAttack: '',
      specialDefense: '',
    },
    height: '',
    weight: '',
    eggGroup: '',
    abilities: '',
    genderRatioMale: '',
    genderRatioFemale: '',
    evs: '',
    hatchSteps: '   ',
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    //urls for pokemon information
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    // Get pokemon info
    const pokemonRes = await axios.get(pokemonUrl);

    const name = pokemonRes.data.name;
    const imageUrl = pokemonRes.data.sprites.front_default;

    let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

    pokemonRes.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case 'hp':
          hp = stat['base_stat'];
          break;
        case 'attack':
          attack = stat['base_stat'];
          break;
        case 'defense':
          defense = stat['base_stat'];
          break;
        case 'speed':
          speed = stat['base_stat'];
          break;
        case 'special-attack':
          specialAttack = stat['base_stat'];
          break;
        case 'special-defense':
          specialDefense = stat['base_stat'];
          break;
      }
    });

    const height = pokemonRes.data.height;
    const weight = pokemonRes.data.weight;

    const types = pokemonRes.data.types.map((type) => type.type.name);

    const abilities = pokemonRes.data.abilities.map((ability) => {
      return ability.ability.name
        .toLowerCase()
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    });

    const evs = pokemonRes.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name
          .toLowerCase()
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')}`;
      })
      .join(', ');

    //Get pokemon description, Catch rate, eggGroups, Gender ratio, match steps, habitat

    await axios.get(pokemonSpeciesUrl).then((res) => {
      let description = '';
      res.data.flavor_text_entries.some((flavor) => {
        if (flavor.language.name === 'en') {
          description = flavor.flavor_text;
          return;
        }
      });

      const femaleRate = res.data['gender_rate'];
      const genderRatioFemale = 12.5 * femaleRate;
      const genderRatioMale = 12.5 * (8 - femaleRate);

      const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

      const eggGroups = res.data['egg_groups']
        .map((group) => {
          return group.name
            .toLowerCase()
            .split('-')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        })
        .join(', ');

      const habitat = res.data['habitat'].name
        .toLowerCase()
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

      //   const habitat = res.data['habitat'].name;

      const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

      this.setState({
        description,
        genderRatioFemale,
        genderRatioMale,
        catchRate,
        eggGroups,
        habitat,
        hatchSteps,
      });
    });

    this.setState({
      imageUrl,
      pokemonIndex,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },
      height,
      weight,
      abilities,
      evs,
    });
  }
  render() {
    const slideAnimation = keyframes`${slideInDown}`;
    const SlidyDiv = styled.div`
      animation: 1s ${slideAnimation};
    `;

    return (
      <div style={{ height: '100% !important' }}>
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
        </nav>
        <SlidyDiv>
          <Wrapper>
            <div className='row'>
              <div className='col-6 mt-3'>
                <h6 className='index ml-3'>POKEDEX</h6>
              </div>
              <div className='col-6 mt-3 '>
                <h5 className='index float-right mr-5'>
                  {this.state.pokemonIndex}
                </h5>
              </div>
            </div>
            <div className='row'>
              <div className='col-5'>
                <img
                  src={this.state.imageUrl}
                  className='rounded mx-auto mt-2'
                />
              </div>

              <div className='col-7 mt-3'>
                <div className='row align-items-center'>
                  <div className='col-md-5'>
                    <h3 style={{ color: '#d84339' }}>
                      <b>{this.state.name.toUpperCase()}</b>
                    </h3>
                  </div>
                  <div className='col-md-7'>
                    <div className='row p-2'>
                      {this.state.types.map((type) => (
                        <h3>
                          <span
                            key={type}
                            className='badge badge-primary badge-pill mr-2'
                            style={{
                              backgroundColor: `#${TYPE_COLORS[type]}`,
                              color: 'white',
                            }}
                          >
                            {type
                              .toLowerCase()
                              .split(' ')
                              .map(
                                (s) =>
                                  s.charAt(0).toUpperCase() + s.substring(1)
                              )
                              .join(' ')}
                          </span>
                        </h3>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='row align-items-center mr-5 mt-2'>
                  <div className='col-12 col-md-3'>
                    <h5 className='index'>Height</h5>
                  </div>
                  <div className='col-12 col-md-9'>
                    <h5>{this.state.height}</h5>
                  </div>
                  <div className='col-12 col-md-3'>
                    <h5 className='index'>Weight</h5>
                  </div>
                  <div className='col-12 col-md-9'>
                    <h5>{this.state.weight}</h5>
                  </div>
                  <div className='col-12 col-md-3'>
                    <h5 className='index'>Habitat</h5>
                  </div>
                  <div className='col-12 col-md-9'>
                    <h5>{this.state.habitat}</h5>
                  </div>
                  <div className='row align-items-center ml-3 mt-3 mr-3'>
                    <p
                      className=''
                      style={{
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                      }}
                    >
                      {this.state.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='row mt-1'>
              <div className='col-5'>
                <div className='row align-items-center ml-3 mr-1'>
                  <div className='col-4'>
                    <h6>Egg Groups:</h6>
                  </div>
                  <div className='col-8'>
                    <h6>{this.state.eggGroups}</h6>
                  </div>
                </div>
                <div className='row align-items-center ml-3 mr-1'>
                  <div className='col-4'>
                    <h6>Hatch Steps:</h6>
                  </div>
                  <div className='col-8'>
                    <h6>{this.state.hatchSteps}</h6>
                  </div>
                </div>
                <div className='row align-items-center ml-3 mr-1'>
                  <div className='col-4'>
                    <h6>Abilities:</h6>
                  </div>
                  <div className='col-8'>
                    <h6>{this.state.abilities}</h6>
                  </div>
                </div>
                <div className='row align-items-center ml-3 mr-1'>
                  <div className='col-4'>
                    <h6>EVs:</h6>
                  </div>
                  <div className='col-8'>
                    <h6>{this.state.evs}</h6>
                  </div>
                </div>
                <div className='row align-items-center ml-3 mr-1'>
                  <div className='col-4'>
                    <h6>Gender Ratio:</h6>
                  </div>
                  <div className='col-8'>
                    <div className='progress'>
                      <div
                        className='progress-bar '
                        role='progressbar'
                        style={{
                          width: `${this.state.genderRatioFemale}%`,
                          backgroundColor: '#d84339',
                        }}
                        aria-valuenow='15'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.genderRatioFemale}</small>
                      </div>
                      <div
                        className='progress-bar bg-info '
                        role='progressbar'
                        style={{
                          width: `${this.state.genderRatioMale}%`,
                          backgroundColor: '#1976d2',
                        }}
                        aria-valuenow='30'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-7'>
                <div className='row align-items-center mr-5'>
                  <div className='col-12 col-md-3'>HP</div>
                  <div className='col-12 col-md-9'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info '
                        role='progressbar'
                        style={{
                          width: `${this.state.stats.hp}%`,
                        }}
                        aria-valuenow='25'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.hp}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row align-items-center mr-5'>
                  <div className={`col-12 col-md-3`}>Attack</div>
                  <div className={`col-12 col-md-9`}>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info '
                        role='progressbar'
                        style={{
                          width: `${this.state.stats.attack}%`,
                        }}
                        aria-valuenow='25'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.attack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row align-items-center mr-5'>
                  <div className={`col-12 col-md-3`}>Defense</div>
                  <div className={`col-12 col-md-9`}>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info  '
                        role='progressbar'
                        style={{
                          width: `${this.state.stats.defense}%`,
                        }}
                        aria-valuenow='25'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.defense}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row align-items-center mr-5'>
                  <div className={`col-12 col-md-3`}>Speed</div>
                  <div className={`col-12 col-md-9`}>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info '
                        role='progressbar'
                        style={{
                          width: `${this.state.stats.speed}%`,
                        }}
                        aria-valuenow='25'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.speed}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row align-items-center mr-5'>
                  <div className={`col-12 col-md-3`}>Special Attack</div>
                  <div className={`col-12 col-md-9`}>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info  '
                        role='progressbar'
                        style={{
                          width: `${this.state.stats.specialAttack}%`,
                        }}
                        aria-valuenow={this.state.stats.specialAttack}
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.specialAttack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row align-items-center mr-5'>
                  <div className='col-12 col-md-3'>Special Defence</div>
                  <div className='col-12 col-md-9'>
                    <div className='progress'>
                      <div
                        className='progress-bar bg-info  '
                        role='progressBar'
                        style={{
                          width: `${this.state.stats.specialDefense}%`,
                        }}
                        aria-valuenow='25'
                        aria-valuemin='0'
                        aria-valuemax='100'
                      >
                        <small>{this.state.stats.specialDefense}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </SlidyDiv>
      </div>
    );
  }
}
