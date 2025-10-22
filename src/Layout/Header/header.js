import React, {Component} from 'react';
import './header.scss';

class Header extends Component {
    render() {
        return (
            <header className="header">
                <p>header</p>
                <a href="/sing_in">
                    <button>Sing In</button>
                </a>
            </header>
        );
    }
}

export default Header;