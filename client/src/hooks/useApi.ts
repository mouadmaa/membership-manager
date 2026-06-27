import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { getFetcher } from 'src/api/fetcher';

export function useApi<T>(path: string | null): SWRResponse<T> {
  return useSWR<T>(path, getFetcher);
}

export const swrConfig: SWRConfiguration = {
  fetcher: getFetcher,
  revalidateOnFocus: false,
};
