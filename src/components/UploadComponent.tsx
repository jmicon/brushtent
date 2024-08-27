"use client"
import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { button } from '@nextui-org/theme'

type Props = {}


const UploadComponent = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [file, setFile ] = useState<File | undefined>()
  const [images, setImages] = useState<string[]>()
  const [error, setError] = useState("")

  // Functions 

  // string of tags to be separated only by commas
  const cleanTags = (tagString: string) => {
    const tagsArr = tagString.split(',');
    const cleanedTags = tagsArr.map(tag => tag.trim());
    return cleanedTags.join(',');
}

  // Convert images to base64 (convertToBase64) and set them to state variable (addImages)
  const convertToBase64 = (imageFile:File) => {

    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        if (imageFile !== null) reader.readAsDataURL(imageFile)
        
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    
    })
}
  const addImages = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles = e.target.files
    const b64List: string[] = []

    if (imageFiles === null) return 
    for (let file = 0; file < imageFiles.length; file++) {
        let data = await convertToBase64(imageFiles[file])
        if (typeof(data) === "string") b64List.push(data)
    }
    setImages(b64List)
}

    // convert base64 image array to a string separated by <<end here>> to add to the formdata
    const base64ImagesString = (imagesArray: string[]) => {
      let base64ImagesString = ""
      if (imagesArray.length === 1) base64ImagesString = imagesArray[0]
      else {
        for (let i = 0; i < imagesArray?.length; i++) {
          let indexString = imagesArray[i] + "<<end here>>"
          base64ImagesString += indexString
        }
      }
      return base64ImagesString
    }

// set files to state variable
  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    } 
    setFile(target.files[0])
  }


  // Upload data to API
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!title) return setError("Include a title")
    if (typeof file === 'undefined') return setError("Include an upload file")  
    if (typeof images === 'undefined') return setError("Include at least one image")

    // convert base64 image array to a string separated by <<end here>> to add to the formdata
    // let cleanedBase64ImagesString = base64ImagesString(images)
    const imagesString = JSON.stringify(images)

    // remove spaces after , in tags
    const cleanTagsString = cleanTags(tags)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("tags", cleanTagsString)  
    formData.append("images", imagesString)  

    formData.append("test", JSON.stringify(['1','2','3']))  
    
    const response = await fetch(`/api/product/create`, {
      method: "POST",
      body: formData
    })
    if (!response.ok) {
      const errorResponse = await response.json()
      setError(errorResponse.error)
    }
    const responseMessage = response.json()
    console.log(responseMessage)
  }
  

  return (
    <>
    <section className='border m-auto mt-4 p-4 lg:max-w-screen-xl'>
      
        <h1>Upload</h1>

        <label>Title</label>
        <input className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={e => setTitle(e.target.value)}></input>

        <label>Description</label>
        <textarea cols={30} rows={5} className='w-full block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={e => setDescription(e.target.value)}></textarea>

        <label>Tags</label>
        <textarea cols={30} rows={2} className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={e => setTags(e.target.value)} placeholder='separate tags by comma (foliage, sketch)'></textarea>

        <h2 className='py-4'>Product images 5 maximum</h2>
        <input 
            accept='image/*'
            type='file'
            onChange={e => addImages(e)}   
            multiple
        />

        <h2 className='py-4'>Upload your brush file (cannot be a zip/rar)</h2>
        <input type="file" onChange={handleFileChange} multiple/>

        <div className='py-4'>
            <Button onClick={handleSubmit}>Post listing</Button>
            <div className='pt-4 text-red-600'>{error}</div>
        </div>
    </section>
    </>
  )
}

export default UploadComponent


