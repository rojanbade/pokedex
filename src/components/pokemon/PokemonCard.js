import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import spinner from '../pokemon/giphy.gif';

import styled from 'styled-components';

const Sprite = styled.img`
  width: 6em;
  height: 6em;
  display: none;
`;

const Card = styled.div`
  background: whitesmoke;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  user-select: none;
  -o-user-select: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #373234;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default class PokemonCard extends Component {
  state = {
    name: '',
    imageUrl: '',
    pokemonIndex: '',
    imageLoading: true,
    toManyRequests: false,
  };

  componentDidMount() {
    const { name, url } = this.props;
    const pokemonIndex = url.split('/')[url.split('/').length - 2];
    const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

    this.setState({
      name,
      imageUrl,
      pokemonIndex,
    });
  }
  render() {
    return (
      <div className='col-md-3 col-sm-6 mb-5'>
        <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
          <Card className='card text-white'>
            <h5 className='card-header' style={{ color: '#373234' }}>
              {this.state.pokemonIndex}
            </h5>
            {this.state.imageLoading ? (
              <img
                src={spinner}
                style={{ width: '6em', height: '6em' }}
                className='card-img rounded mx-auto mt-2'
              />
            ) : null}
            <Sprite
              className='card-img-top rounded mx-auto mt-2'
              onLoad={() => this.setState({ imageLoading: false })}
              onError={() => this.setState({ toManyRequests: true })}
              src={this.state.imageUrl}
              alt='Card image'
              style={
                this.state.toManyRequests
                  ? { display: 'none' }
                  : this.state.imageLoading
                  ? null
                  : { display: 'block' }
              }
            />
            {this.state.toManyRequests ? (
              <h6 className='mx-auto'>
                <span className='badge badge-danger mt-2'>
                  {' '}
                  To Many Request
                </span>
              </h6>
            ) : null}
            <div className='card-body mx-auto'>
              <h5 className='card-title' style={{ color: '#373234' }}>
                {this.state.name
                  .toLowerCase()
                  .split(' ')
                  .map(
                    (letter) =>
                      letter.charAt(0).toUpperCase() + letter.substring(1)
                  )
                  .join(' ')}
              </h5>
            </div>
          </Card>
        </StyledLink>
      </div>
    );
  }
}
