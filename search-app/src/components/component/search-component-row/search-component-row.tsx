/* eslint-disable no-nested-ternary */
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  addPokemon,
  removePokemon,
} from '../../../lib/redux_slice/redux_slice';
import { SearchRowComponentProps } from '../../../interfaces/props_interfaces';
import styles from './search-component-row-style.module.css';
import pokeballStatic from '../../../assets/pics/pokeball.png';
import { useGetPokemonByNameQuery } from '../../../api/getPokemons';
import CheckBox from '../../ui/check_box/check_box';
import { RootState } from '../../../lib/store/store';
import useTheme from '../../../hooks/useTheme-hook';
import PokemonTypes from '../pokemon_types/pokemon_types';

function SearchComponentRow({ id, poke_id }: SearchRowComponentProps) {
  const store = useSelector((state: RootState) => state.pokeStore);
  const dispatch = useDispatch();
  const { pageNum } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useGetPokemonByNameQuery(poke_id || '');

  const [checked, setChecked] = useState<boolean>(false);
  const HandleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
    const createJson = {
      id,
      name: data.name,
      height: data.height,
      experience: data.base_experience,
    };
    dispatch(
      e.currentTarget.checked
        ? addPokemon(createJson)
        : removePokemon(createJson),
    );
  };
  useEffect(() => {
    setChecked(store.find((elem) => elem.name === data.name) !== undefined);
  }, [store]);

  const { theme } = useTheme();
  return (
    <div className={styles['search-row-container']}>
      <NavLink
        to={`/page/${pageNum}/${isLoading ? '' : data.name}?${searchParams}`}
        className={({ isActive, isPending }) =>
          isPending
            ? `${styles['search-row-content']} ${styles[`${theme}`]} ${styles.pending}`
            : isActive
              ? `${styles['search-row-content']} ${styles[`${theme}`]} ${styles.active}`
              : `${styles['search-row-content']} ${styles[`${theme}`]}`
        }
      >
        {isLoading ? (
          <img
            className={styles['loading-prop-img']}
            src={pokeballStatic}
            alt="pokeball"
          />
        ) : (
          <img
            className={styles['small-poke-img']}
            src={data.sprites.other['official-artwork'].front_default}
            alt="small-poke-img"
          />
        )}
      </NavLink>
      <div className={`${styles['name-types-wrapper']} ${styles[`${theme}`]}`}>
        <div className={styles['name-block-wrapper']}>
          <p>
            {isLoading
              ? ''
              : data.name.charAt(0).toUpperCase() + data.name.slice(1)}
          </p>
          {isLoading ? (
            ''
          ) : (
            <CheckBox
              theme={theme}
              checked={checked}
              name={data.name}
              id={`${data.name}-${id}`}
              onChange={HandleOnChange}
            />
          )}
        </div>
        {isLoading ? '' : <PokemonTypes types={data.types} />}
      </div>
    </div>
  );
}

export default SearchComponentRow;
