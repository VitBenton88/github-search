import { mockBasicRepo, mockRepo } from '@mocks/repositories'
import { describe, expect, it, type Mock, vi } from 'vitest'
import { getRepository, searchRepositories } from '@/api'

const mockFetch = vi.fn()

global.fetch = mockFetch as Mock

const mockRepoData = {
  ...mockRepo,
  private: false,
  owner: {
    login: mockRepo.owner,
    html_url: mockRepo.owner_url
  }
}

describe('api.ts', () => {
  describe('searchRepositories', () => {
    it('returns basic repository data', async () => {
      const mockResponse = {
        items: [
          mockRepoData
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await searchRepositories('test', false)

      expect(result).toEqual([mockBasicRepo])

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

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=git+stars:>1000')
      )
    })

    it('throws an error on failed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error'
      })

      await expect(searchRepositories('fail', false)).rejects.toThrow(
        'Failed to search repositories. 500 Server Error'
      )
    })
  })

  describe('getRepository', () => {
    it('returns full repository data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepoData
      })
      const result = await getRepository(mockRepo.owner, mockRepo.name)

      expect(result).toEqual(mockRepo)
    })

    it('throws an error on failed fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(getRepository('bad', 'repo')).rejects.toThrow(
        'Failed to fetch repository. 404 Not Found'
      )
    })
  })
})