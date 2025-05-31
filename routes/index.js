const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  res.render('index', { title: 'JzTools - Powerful Web Tools in One Place' });
});

router.get('/downloader', (req, res) => {
  res.render('downloader', { title: 'JzTools - Downloader', error: null, downloadData: null });
});

router.get('/searcher', (req, res) => {
  res.render('searcher', { title: 'JzTools - Searcher', error: null, searchResults: null });
});

router.get('/cloud', (req, res) => {
  res.render('cloud', { title: 'JzTools - Cloud Storage' });
});

router.post('/download', async (req, res) => {
  if (!req.body) {
    return res.render('downloader', {
      title: 'JzTools - Downloader',
      error: 'Data form tidak diterima. Pastikan form dikirim dengan benar.',
      downloadData: null
    });
  }

  const { platform, url } = req.body;

  if (!platform || !url) {
    return res.render('downloader', {
      title: 'JzTools - Downloader',
      error: 'Harap pilih platform dan masukkan URL yang valid.',
      downloadData: null
    });
  }

  const urlPattern = /^(https?:\/\/)/i;
  if (!urlPattern.test(url)) {
    return res.render('downloader', {
      title: 'JzTools - Downloader',
      error: 'URL tidak valid. Pastikan dimulai dengan http:// atau https://.',
      downloadData: null
    });
  }

  try {
    let apiEndpoint;
    let response;

    switch (platform) {
      case 'tiktok':
        apiEndpoint = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
        response = await axios.get(apiEndpoint);
        if (!response.data.id || !response.data.video.noWatermark) {
          throw new Error('Gagal mendapatkan data dari TikTok API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      case 'youtube':
        apiEndpoint = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(url)}&quality=720&server=auto`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari YouTube API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      case 'spotify':
        apiEndpoint = `https://api.agatz.xyz/api/spotifydl?url=${encodeURIComponent(url)}`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari Spotify API.');
        }
        response.data.creator = 'JzuvDev';
        response.data.data = JSON.parse(response.data.data);
        break;

      default:
        return res.render('downloader', {
          title: 'JzTools - Downloader',
          error: 'Platform tidak didukung.',
          downloadData: null
        });
    }

    let downloadData;
    switch (platform) {
      case 'tiktok':
        const tiktokData = response.data;
        downloadData = {
          url: tiktokData.video.noWatermark,
          title: tiktokData.title,
          thumbnail: tiktokData.video.cover,
          duration: tiktokData.video.durationFormatted
        };
        break;
      case 'youtube':
        const youtubeData = response.data.result;
        downloadData = {
          url: youtubeData.media,
          title: youtubeData.title,
          thumbnail: youtubeData.metadata.thumbnail,
          duration: youtubeData.metadata.duration
        };
        break;
      case 'spotify':
        const spotifyData = response.data.data;
        downloadData = {
          url: spotifyData.url_audio_v1,
          title: spotifyData.judul,
          thumbnail: spotifyData.gambar_kecil[0].url,
          duration: `${Math.floor(spotifyData.durasi / 60)}:${(spotifyData.durasi % 60).toString().padStart(2, '0')}`
        };
        break;
    }

    if (!downloadData.url) {
      throw new Error('Tautan unduhan tidak ditemukan.');
    }

    res.render('downloader', {
      title: 'JzTools - Downloader',
      error: null,
      downloadData
    });
  } catch (error) {
    console.error('Error saat memanggil API:', error.message);
    res.render('downloader', {
      title: 'JzTools - Downloader',
      error: `Terjadi kesalahan: ${error.message}`,
      downloadData: null
    });
  }
});

router.get('/search', async (req, res) => {
  const { platform, question } = req.query;

  if (!platform || !question) {
    return res.render('searcher', {
      title: 'JzTools - Searcher',
      error: 'Harap pilih platform dan masukkan kata kunci pencarian.',
      searchResults: null
    });
  }

  try {
    let apiEndpoint;
    let response;

    switch (platform) {
      case 'tiktok':
        apiEndpoint = `https://fastrestapis.fasturl.cloud/search/tiktok?name=${encodeURIComponent(question)}`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari TikTok API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      case 'lk21':
        apiEndpoint = `https://fastrestapis.fasturl.cloud/search/lk21?action=search&query=${encodeURIComponent(question)}`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari LK21 API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      case 'pinterest':
        apiEndpoint = `https://fastrestapis.fasturl.cloud/search/pinterest/simple?name=${encodeURIComponent(question)}`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari Pinterest API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      case 'gimage':
        apiEndpoint = `https://fastrestapis.fasturl.cloud/search/gimage?ask=${encodeURIComponent(question)}`;
        response = await axios.get(apiEndpoint);
        if (response.data.status !== 200) {
          throw new Error('Gagal mendapatkan data dari Google Image API.');
        }
        response.data.creator = 'JzuvDev';
        break;

      default:
        return res.render('searcher', {
          title: 'JzTools - Searcher',
          error: 'Platform tidak didukung.',
          searchResults: null
        });
    }

    let searchResults;
    switch (platform) {
      case 'tiktok':
        searchResults = response.data.result.map(item => ({
          title: item.metadata.title,
          thumbnail: item.metadata.thumbnail,
          url: item.media.no_watermark,
          author: item.author.name,
          username: item.author.username,
          stats: item.stats,
          created_at: item.metadata.created_at,
          download_url: item.media.no_watermark
        }));
        break;
      case 'lk21':
        searchResults = response.data.result.map(item => ({
          title: item.title,
          thumbnail: item.image,
          url: item.videoLink,
          author: item.country,
          username: item.genres,
          stats: { rating: item.rating || 'N/A' },
          created_at: item.title.match(/\(\d{4}\)/)?.[0]?.replace(/[()]/g, '') || 'N/A',
          download_url: item.videoLink
        }));
        break;
      case 'pinterest':
        searchResults = response.data.result.map(item => ({
          title: item.title || 'No Title',
          thumbnail: item.directLink,
          url: item.link,
          author: item.altText || 'Unknown',
          username: item.description || 'No Description',
          stats: { likes: 'N/A' },
          created_at: 'N/A',
          download_url: item.directLink
        }));
        break;
      case 'gimage':
        searchResults = response.data.result.map(item => ({
          title: item.title || 'No Title',
          thumbnail: item.image,
          url: item.url,
          author: 'Google Image',
          username: 'N/A',
          stats: { likes: 'N/A' },
          created_at: 'N/A',
          download_url: item.image
        }));
        break;
    }

    res.render('searcher', {
      title: 'JzTools - Searcher',
      error: null,
      searchResults,
      platform,
      query: question
    });
  } catch (error) {
    console.error('Error saat memanggil API:', error.message);
    res.render('searcher', {
      title: 'JzTools - Searcher',
      error: `Terjadi kesalahan: ${error.message}`,
      searchResults: null
    });
  }
});
module.exports = router;