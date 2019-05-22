import {
    Button,
    FormGroup,
    InputGroup,
} from '@blueprintjs/core';
import * as H from 'history';
import * as React from 'react';
import {
    RouteComponentProps,
    withRouter
} from 'react-router-dom';
import './road-closure-login.css';

import '../../../node_modules/@blueprintjs/core/lib/css/blueprint.css';
export interface IRoadClosureLoginProps {
    login: (u: string, p: string, history?: H.History) => void,
    isLoggedIn: boolean,
    isLoggingIn: boolean,
    orgName: string,
    redirectOnLogin: boolean,
};

export interface IRoadClosureLoginState {
    username: string,
    password: string,
    showPassword: boolean,
}

class RoadClosureLogin extends React.Component<IRoadClosureLoginProps & RouteComponentProps<any>, IRoadClosureLoginState> {
    public constructor(props: IRoadClosureLoginProps & RouteComponentProps<any>) {
        super(props);

        this.state = {
            password: '',
            showPassword: false,
            username: '',
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleToggleShowPassword = this.handleToggleShowPassword.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
    }

    public componentDidMount() {
        if (this.props.isLoggedIn && this.props.redirectOnLogin) {
            this.props.history.push(`/${this.props.orgName}`)
        }
    }

    public handleToggleShowPassword() {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    public handleChangeUsername(e: any) {
        this.setState({
            username: e.target.value
        });
    }

    public handleChangePassword(e: any) {
        this.setState({
            password: e.target.value
        });
    }

    public handleLogIn() {
        if (this.props.redirectOnLogin) {
            this.props.login(
                this.state.username,
                this.state.password,
                this.props.history,
            );
        } else {
            this.props.login(
                this.state.username,
                this.state.password,
            );
        }
    }

    public render() {
        return (
            <form>
                <FormGroup>
                    <InputGroup
                        onChange={this.handleChangeUsername}
                        id="username-input"
                        placeholder="Enter your username..." />
                    <InputGroup
                        onChange={this.handleChangePassword}
                        id="password-input"
                        type={this.state.showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        rightElement={
                            <Button
                                icon={this.state.showPassword ? "unlock" : "lock"}
                                minimal={true}
                                onClick={this.handleToggleShowPassword}
                            />
                        }/>
                    <Button
                        type={"submit"}
                        disabled={this.state.username.length === 0 || this.state.password.length === 0}
                        intent={"primary"}
                        fill={true}
                        text={"Log in"}
                        onClick={this.handleLogIn}
                        loading={this.props.isLoggingIn}
                    />
                </FormGroup>
            </form>
        );
    }
}

export default withRouter(RoadClosureLogin);
