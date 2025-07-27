

export function formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function getDisplayName(item: MusicKit.Resource): string {
    return item.attributes.name || item.attributes.title?.stringForDisplay || item.type || 'Unknown'
}

export function getArtworkUrl(item: MusicKit.Resource, size: number = 400): string {
    if (item.attributes.artwork?.url) {
        return item.attributes.artwork.url.replace('{w}', size.toString()).replace('{h}', size.toString())
    }
    return `/placeholder.svg?height=${size}&width=${size}`
}

export function getDuration(item: MusicKit.Resource): number {
    // Return duration in seconds, default to 180 seconds (3 minutes) if not available
    return item.attributes.durationInMillis ? Math.floor(item.attributes.durationInMillis / 1000) : 180
}

export function getRandomSongs(recommendations: MusicKit.PersonalRecommendation[], count: number = 50) {

    // Randomly shuffle and pick the requested number of songs
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}