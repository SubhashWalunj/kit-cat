

import React, { ReactElement, useState } from 'react';


import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, message, Upload, UploadProps } from 'antd';
import ENDPOINT_URL_CONSTANTS from '../../constants/endpoint-url.constants';
import { createFetchRequestArgs } from '../../factories/fetch.factories';
import { HTTP_METHODS } from '../../enums/http-methods.enum';
import { RcFile } from 'antd/lib/upload';
import ImgCrop from 'antd-img-crop';

import './cat-upload.css';
import { Redirect } from 'react-router';
import BackToHome from '../back-to-home/back-to-home';

function CatUpload(): ReactElement {
    const [file, setFile] = useState<RcFile>();
    const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer>('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState<null | ReactElement>(null);

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const getBase64 = (img: RcFile, callback: (imageUrl: string | null | ArrayBuffer) => void) => {
        const reader = new FileReader();
        //if (reader.result) {
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
        //}
    }

    const beforeUpload = (file: RcFile) => {
        setFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            if (e) {
                //file.thumbUrl = e.target!.result;
                getBase64(file, (imageUrl: string | null | ArrayBuffer) => {
                    setImageUrl(imageUrl);
                    setLoading(false);
                });
            }
        }
        return false;
    }

    const handleUpload = async () => {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file!);

        const uploadImageFetchRequestArgs = createFetchRequestArgs(
            HTTP_METHODS.POST,
            `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.UPLOAD}`,
            {},
            formData
        );

        try {
            const catUploadResult = await fetch(...uploadImageFetchRequestArgs);
            const catUploadJson: any = await catUploadResult.json();
            if (!catUploadResult.ok) {
                message.error(`There is an error occurred while uploading the image. Please try again. ${catUploadJson.message}`);
                setUploading(false);
            } else {
                setUploading(false);
                setRedirectToHome(<Redirect to="/" />);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                message.error(`There is an error occurred while uploading the image. Please try again. ${err.message || ''}`);
            }
            setUploading(false);
        }
    };

    const props: UploadProps = {
        name: "cat-upload",
        listType: "picture-card",
        className: "photoUploader",
        showUploadList: false,
        multiple: false,
        beforeUpload: beforeUpload
    };

    return (
        <>
            <BackToHome />
            <Card className="photoUploadContainer">
                <ImgCrop rotate>
                    <Upload
                        {...props}
                    >
                        {imageUrl ? <img src={imageUrl.toString()} style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </ImgCrop>
                <br />
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={!file}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </Card>
            {redirectToHome}
        </>
    );
}

export default CatUpload;