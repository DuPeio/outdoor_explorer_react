import { useState } from 'react';

function LoginPage({send, currentUsername}) {

    const [username, setUsername] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        send(username);
    }

    return (
        <div className="connexion-container">
            <div className="connexion-title">Outdoor<br />Explorer</div>
            <div className="connexion-subtitle">LES SPORTS PLEIN AIR</div>

            <div className="connexion-part">

                {currentUsername ? (
                    <div>
                        Connecté en tant que : {currentUsername}
                    </div>
                ) : (
                    <div>Connectez-vous pour continuer !</div>
                )}

                <form className="connexion-form" onSubmit={handleSubmit}>
                    <p>
                        <img src="/assets/icons/user.svg" alt="user icon"/>
                        <input className="connexion-input" type="text" placeholder="Nom d'utilisateur"
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </p>
                    <button className="connexion-submit" id="connexionSubmit" type="submit">Connexion</button>
                </form>
            </div>
        </div>
    );



}

export default LoginPage;