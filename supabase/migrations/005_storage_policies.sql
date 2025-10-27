-- Storage policies for gems-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload gem images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gems-images'
  AND auth.role() = 'authenticated'
);

-- Allow public read access to gem images
CREATE POLICY "Allow public read access to gem images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gems-images');

-- Allow authenticated users to update/delete their own uploads
CREATE POLICY "Allow users to update own gem images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gems-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete own gem images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gems-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Service role has full access
CREATE POLICY "Service role full access to gem images"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'gems-images')
WITH CHECK (bucket_id = 'gems-images');