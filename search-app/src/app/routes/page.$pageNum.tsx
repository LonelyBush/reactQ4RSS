import { json, LoaderFunctionArgs } from '@remix-run/server-runtime';
import { Outlet } from '@remix-run/react';
import ItemsList from '../../components/base/items_list/items_list';
import getSearchQueryData from '../../utils/funcs/get-search-query-data';
import { PokeCall } from '../../interfaces/api_interfaces';
import Pagination from '../../components/base/pagination/pagination-items-list';
import SearchBar from '../../components/base/search_bar/search_bar';
import Footer from '../../components/base/footer/footer';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { pageNum } = params;
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('query');
  const postPerPage = 20;
  let currentPosts;
  let resultsLength;
  try {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=1017&offset=0',
    );
    if (!response) {
      throw new Error('Fetch failed');
    }
    const data = (await response.json()) as PokeCall;
    if (data !== undefined) {
      const { results } = data;
      const getFilteredResults = getSearchQueryData(searchQuery || '', results);
      resultsLength = getFilteredResults.length;
      const indexOfLastPage = Number(pageNum) * postPerPage;
      const firstPostIndex = indexOfLastPage - postPerPage;
      currentPosts = getFilteredResults.slice(firstPostIndex, indexOfLastPage);
    }
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
  }
  return json({ currentPosts, resultsLength });
}

export default function SearchPage() {
  return (
    <>
      <header>
        <SearchBar />
      </header>
      <main>
        <ItemsList />
        <Outlet />
      </main>
      <footer>
        <Pagination />
        <Footer />
      </footer>
    </>
  );
}
