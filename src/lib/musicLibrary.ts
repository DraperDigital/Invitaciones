export interface MusicTrack {
    id: string;
    name: string;
    title?: string;
    category: string;
    url: string;
    author?: string;
}

export const MUSIC_LIBRARY: MusicTrack[] = [
    {
        id: 'acoustic-romance',
        name: 'Acoustic Romance',
        title: 'Acoustic Romance',
        category: 'Romántica / Boda',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitars-ambient-uplifting-112771.mp3',
        author: 'Libre de regalías'
    },
    {
        id: 'cinematic-piano',
        name: 'Piano Dreams',
        title: 'Piano Dreams',
        category: 'Elegante / Boda & XV',
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=inspiring-cinematic-ambient-116199.mp3',
        author: 'Libre de regalías'
    },
    {
        id: 'emotional-strings',
        name: 'Vals de Ensueño',
        title: 'Vals de Ensueño',
        category: 'Clásica / Vals',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_82c2a29dc5.mp3?filename=emotional-piano-and-strings-10822.mp3',
        author: 'Libre de regalías'
    },
    {
        id: 'happy-celebration',
        name: 'Celebración Alegre',
        title: 'Celebración Alegre',
        category: 'Fiesta / Cumpleaños',
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c9175347.mp3?filename=happy-acoustic-guitar-110055.mp3',
        author: 'Libre de regalías'
    },
    {
        id: 'gentle-lullaby',
        name: 'Dulce Espera',
        title: 'Dulce Espera',
        category: 'Baby Shower / Bautizo',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f77c30.mp3?filename=lullaby-ambient-123253.mp3',
        author: 'Libre de regalías'
    }
];
