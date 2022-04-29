import { ReactElement, useMemo } from 'react'
import httpR from '../support/request';

const Control: React.FC = (props: any) : ReactElement => {
    useMemo(() => {
        httpR.post('/api/json/get')
    }, [])

    return (<>CONTROL</>);
}

export default Control