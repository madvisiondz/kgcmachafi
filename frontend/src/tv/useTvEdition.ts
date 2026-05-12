import { useParams } from 'react-router-dom';
import { isTvEdition, type TvEdition } from '../routes/paths';

export function useTvEdition(): TvEdition {
  const { edition } = useParams();
  return isTvEdition(edition) ? edition : 'ar';
}
