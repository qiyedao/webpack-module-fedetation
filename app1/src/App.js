import React, { Suspense } from 'react';
const RemoteApp = React.lazy(() => import('app2/App'));
import Button from 'app2/Button';
const withForm = config => WrappedComponent =>
    class Demo extends React.Component {
        render() {
            return <WrappedComponent />;
        }
    };

const create = params => {
    return WrappedComponent => {
        return class Demo extends React.Component {
            render() {
                return <WrappedComponent />;
            }
        };
    };
};

const App = () => {
    return (
        <div>
            <div
                style={{
                    margin: '10px',
                    padding: '10px',
                    textAlign: 'center',
                    backgroundColor: 'greenyellow',
                }}
            >
                <h1>App1 load</h1>
                <Button />
            </div>
            <Suspense fallback={'loading...'}>
                <RemoteApp />
            </Suspense>
        </div>
    );
};

export default App;
