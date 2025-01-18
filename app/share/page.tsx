// app/share/page.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';

// 假定的分享内容
const shareInfo = {
    type: 'video', // 假设分享视频
    title: '测试分享标题',
    content: '这是测试分享的内容正文',
    images: [], // 图片地址，需要是服务器地址
    video: 'https://video-sg.tiktokv.com/storage/v1/tos-alisg-pv-0037c001/o86iDfgOEEuUIqvtUgngBKJItRbAfdmiB1FAb?a=1233&bti=Ojw6QDA1M2A%3D&ch=0&cr=0&dr=0&cd=0%7C0%7C07C0&br=18296&bt=9148&ds=4&ft=.A~idInz7ThcyuPOXq8Zmo&mime_type=video_mp4&qs=13&rc=anAzNGo5cjZ1eDMzNEpBpanAzNGo5cj1eDMzNEpBtcTyMmRcTfGLSkMTFzYSNtcTymRcTfQLS1kMTFzcw3D&l=20250117072603F2923AFE8C76780A3F0B&btag=200070000&x-tos-algorithm=v2&x-tos-authkey=5bf25627da095a5cba28ace592de6cc&x-tos-expires=1737962766&x-tos-signature=7vq8l4dCOZd1rDsQE_ZB4qJpM&', // 视频地址，需要是服务器地址
    cover: 'https://example.com/test-cover.jpg', // 封面图地址，需要是服务器地址
};

const SharePage = () => {
    const handleShare = async () => {
        const response = await fetch('/api/share');
        const { appKey, nonce, timestamp, signature } = await response.json();

        const shareConfig = {
            shareInfo: {
                ...shareInfo,
            },
            verifyConfig: {
                appKey,
                nonce,
                timestamp,
                signature,
            },
            fail: (e: any) => {
                console.error('分享失败', e);
            },
        };

        // 调用小红书分享方法
        window.xhs.share(shareConfig);
    };

    useEffect(() => {
        // 确保小红书 JS SDK 加载完毕后再调用分享
        const sdkScript = document.createElement('script');
        sdkScript.src = "https://fe-static.xhscdn.com/biz-static/goten/xhs-1.0.1.js";
        sdkScript.async = true;
        sdkScript.onload = () => {
            handleShare();
        };
        document.body.appendChild(sdkScript);
    }, []);

    return (
        <>
            <Head>
                <title>分享到小红书</title>
            </Head>
            <main>
                <h1>分享到小红书</h1>
                <button onClick={handleShare}>分享视频到小红书</button>
            </main>
        </>
    );
};

export default SharePage;