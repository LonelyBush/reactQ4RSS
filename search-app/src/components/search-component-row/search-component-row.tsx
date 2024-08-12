import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { addPokemon, removePokemon } from '../../redux_slice/redux_slice';
import { SearchRowComponentProps } from '../../interfaces/props_interfaces';
import styles from './search-component-row-style.module.css';
import pokeballStatic from '../../../assets/pics/pokeball.png';
import { useGetPokemonByNameQuery } from '../../api/getPokemons';
import CheckBox from '../ui/check_box/check_box';
import { RootState } from '../../store/store';
import useTheme from '../../hooks/useTheme-hook';

function SearchComponentRow({ name, id }: SearchRowComponentProps) {
  const store = useSelector((state: RootState) => state.pokeStore);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetPokemonByNameQuery(name);
  const [checked, setChecked] = useState<boolean>(false);
  const HandleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
    const createJson = {
      id,
      name,
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
    setChecked(store.find((elem) => elem.name === name) !== undefined);
  }, [store]);

  const { theme } = useTheme();
  return (
    <div className={styles['search-row-container']}>
      <NavLink
        to={`detail/${name}`}
        className={({ isActive }) =>
          isActive
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
            src={data ? data.sprites.front_default : null}
            alt="small-poke-img"
          />
        )}
        <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
      </NavLink>
      <CheckBox
        theme={theme}
        checked={checked}
        name={name}
        id={`${name}-${id}`}
        onChange={HandleOnChange}
      />
    </div>
  );
}

export default SearchComponentRow;
