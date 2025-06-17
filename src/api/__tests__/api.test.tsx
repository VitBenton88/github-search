import { mockRepository, mockSearchResult } from '@mocks/repositories'
import { describe, expect, it, type Mock, vi } from 'vitest'
import { getRepository, searchRepositories } from '@/api'
import { mockRepoApiResponse } from '@/test/__mocks__/api'

const mockFetch = vi.fn()

global.fetch = mockFetch as Mock

describe('api.ts', () => {
  describe('searchRepositories', () => {
    it('returns repository data as search results', async () => {
      const mockResponse = {
        items: [
          mockRepoApiResponse
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await searchRepositories('test', false)

      expect(result).toEqual([mockSearchResult])

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test')
      )
    })

    it('appends stars filter when popularFilter is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] })
      })

      await searchRepositories('git', true)

      const query = 'git stars:>1000'
      // api uses + not space
      const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`q=${encodedQuery}`)
      )
    })

    it('throws an error on failed response', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      })

      await expect(searchRepositories('fail', false)).rejects.toThrow(
        'Failed to search repositories. 500 Server Error'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('getRepository', () => {
    it('returns full repository data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoApiResponse
      })
      const result = await getRepository(mockRepository.owner, mockRepository.name)

      expect(result).toEqual(mockRepository)
    })

    it('throws an error on failed fetch', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(getRepository('bad', 'repo')).rejects.toThrow(
        'Failed to fetch repository. 404 Not Found'
      )

      consoleSpy.mockRestore()
    })
  })
})