import { getData, getAllData } from '../services/api';
import { mockItem, mockItems } from './mocks/mockData';

const createResponse = (data: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    json: () => Promise.resolve(data),
  }) as Response;

describe('API service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getData', () => {
    it('returns parsed pokemon data on success', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(mockItem));
      const result = await getData('bulbasaur');
      expect(result).toEqual(mockItem);
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      );
    });

    it('lowercases the search term', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(mockItem));
      await getData('BULBASAUR');
      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      );
    });

    it('throws "Pokemon not found" on 404', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 404));
      await expect(getData('unknown')).rejects.toThrow(
        'Pokemon not found. Please check the name'
      );
    });

    it('throws "Invalid request" on 400', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 400));
      await expect(getData('')).rejects.toThrow(
        'Invalid request. Please check your input'
      );
    });

    it('throws "Server error" on 500', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 500));
      await expect(getData('bulbasaur')).rejects.toThrow(
        'Server error. Please try again later'
      );
    });

    it('throws "Service unavailable" on 503', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 503));
      await expect(getData('bulbasaur')).rejects.toThrow(
        'Service is temporarily unavailable'
      );
    });

    it('throws generic error for other status codes', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 418));
      await expect(getData('bulbasaur')).rejects.toThrow(
        'Something went wrong'
      );
    });
  });

  describe('getAllData', () => {
    it('fetches list then fetches details for each pokemon', async () => {
      const listResponse = {
        results: [
          { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce(createResponse(listResponse))
        .mockResolvedValueOnce(createResponse(mockItems[0]))
        .mockResolvedValueOnce(createResponse(mockItems[1]));

      const result = await getAllData();
      expect(result).toEqual([mockItems[0], mockItems[1]]);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('throws on failed list fetch', async () => {
      vi.mocked(fetch).mockResolvedValue(createResponse(null, false, 500));
      await expect(getAllData()).rejects.toThrow(
        'Server error. Please try again later'
      );
    });
  });
});
