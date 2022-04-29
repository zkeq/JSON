import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons';
const loadable = (loaders: any) => {
    return Loadable({
        loader: loaders.loader,
        delay: loaders.delay || 100,
        timeout: loaders.timeout || 10000,
        loading: Loading,
    });
};
const Loading = (props: any) => {
    const Loadicon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    if (props.error) {
        return (
            <div style={{
                width: '100%',
                height: '50rem',
                textAlign: 'center',
                position: 'relative',
                lineHeight: '50rem',
                zIndex: 100,
            }}>
                <Spin indicator={Loadicon} tip="request error, please retry." size="large" />
            </div>
        );
    }
    else if (props.timedOut) {
        return (
            <div style={{
                width: '100%',
                height: '50rem',
                textAlign: 'center',
                position: 'relative',
                lineHeight: '50rem',
                zIndex: 100,
            }}>
                <Spin indicator={Loadicon} tip="request timeout, please retry." size="large" />
            </div>
        );
    }
    else if (props.pastDelay) {
        return (
            <div style={{
                width: '100%',
                height: '50rem',
                textAlign: 'center',
                position: 'relative',
                lineHeight: '50rem',
                zIndex: 100,
            }}>
                <Spin indicator={Loadicon} size="large" />
            </div>
        )
    }
    else {
        return (
            <></>
        )
    }
}
export default loadable;