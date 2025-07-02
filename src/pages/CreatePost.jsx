function CreatePost() {
    return (
        <>
            <h1>Create Post</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ textAlign: 'center' }}>Create a New Post</h2>
                    <input type="text" placeholder="Title" style={{ padding: '0.5rem', fontSize: '1rem' }} required />
                    <textarea placeholder="Content" rows={6} style={{ padding: '0.5rem', fontSize: '1rem' }} required />
                    <button type="submit" style={{ padding: '0.75rem', fontSize: '1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Post</button>
                </form>
            </div>
        </>
    );
}

export default CreatePost
