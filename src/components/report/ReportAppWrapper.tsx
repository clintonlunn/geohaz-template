import { useEffect, useState, Suspense, lazy } from 'react';
import { Aoi } from '@/components/report/types/types';

const ReportApp = lazy(() => import('@/components/report/ReportApp'));

const ReportAppWrapper = () => {
    const [aoi, setAoi] = useState<Aoi | null>(null);
    console.log('ReportAppWrapper');

    useEffect(() => {
        const aoiData = localStorage.getItem('aoi');
        if (!aoiData) {
            import('@/components/report/testData.json').then((data) => {
                setAoi(data.default);
            });
        } else {
            setAoi(JSON.parse(aoiData));
        }
    }, []);

    if (!aoi) {
        return <div>Loading...</div>;
    }

    return (
        <Suspense fallback={<div>Loading Report...</div>}>
            <ReportApp {...aoi} />
        </Suspense>
    );
};

export default ReportAppWrapper;