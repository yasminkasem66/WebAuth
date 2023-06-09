import { Component } from '@angular/core';
// import * as CBOR from './lib/cbor.js';
// import { encode, decode } from 'base64-arraybuffer';
import * as CBOR from 'cbor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebAuth';

  makeCredsSample() {

    // PublicKeyCredentialRequestOptions 
    // allowCredentials is used to specify a list of acceptable credentials that the server will accept for authentication
    //       allowCredentials: [
    //   {
    //     type: 'public-key',
    //     id: new Uint8Array([10]),
    //     transports: ['internal']  //"usb", "nfc", "ble", or "internal"
    //   }
    // ],

    // The browser uses this information to communicate with the authenticator device and return a response to the server that includes a signed assertion of the user's identity.
    const publicKeyCredentialCreationOptions = {
      // 1-Server-provided challenge
      challenge: Uint8Array.from(
        "yasminChallenge", c => c.charCodeAt(0)),  // A random challenge that is generated by the server. It is used to mitigate MITM attack. Type of BufferSource

      //2- Relying Party (RP) information
      rp: {
        name: "Duo Security",
        // id: "http://localhost:4200/", //The id must be a subset of the domain currently in the browser. 
      },

      // 3-User account information
      user: {
        id: Uint8Array.from(
          "UZSL85T9AFC", c => c.charCodeAt(0)), //Server generated user identified. Must NOT contain any user information. Should be randomly generated. It is used by the relying party
        name: "yasmin@webauthn.guide",
        displayName: "yasmin Kassem",
        icon: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"
      },

      // 4-Cryptographic parameters
      pubKeyCredParams: [{ alg: -7, type: "public-key" }] as PublicKeyCredentialParameters[], //A list of signing algorithms the server supports. Right now, FIDO2 servers are mandated to support RS1, RS256, ES256 and ED25519. 

      //5- Additional constraints
      authenticatorSelection: {
        // authenticatorAttachment: "platform" as AuthenticatorAttachment,
        // possible options are  
        //"platform": This means the authenticator must be attached to the device (e.g., built-in fingerprint reader).
        // "cross-platform": This means the authenticator can be detached from the device (e.g., USB key).
        // "any": This means the authenticator can be of any type.
        requireResidentKey: true,
        userVerification: "required" as UserVerificationRequirement,
      },

      //6- Timeouts for the operation
      // timeout: 60000,
      //An attestation statement is a signed statement from the authenticator that asserts to the relying party certain properties about the authenticator, such as its model, firmware version, and whether it has passed certain security tests.
  //  attestation: "direct" as AttestationConveyancePreference,
      // An array of objects that define the public key credentials that the server will not accept for authentication. In this example, the server will not accept credentials that have a specific ID and that can only be transported over USB or NFC.
      // This property is typically used to prevent users from accidentally registering the same credential multiple times.
  //     excludeCredentials: [
  //       {
  //         type: "public-key",
  //         id: new Uint8Array([/* 16 random bytes */]),
  //         transports: ["usb", "nfc"],
  //       } as PublicKeyCredentialDescriptor,
  //     ],
  //     // Other properties...
  // allowList: [
  //   {
  //     type: "public-key",
  //     id: new Uint8Array([/* Credential ID bytes */]),
  //     transports: ["usb", "nfc"]
  //   }
  // ],
  // // This property can be used to prevent certain types of credentials from being used, such as credentials with weak security properties.
  // disallowList: [
  //   {
  //     type: "public-key",
  //     id: new Uint8Array([/* Credential ID bytes */])
  //   }
  // ]
    };

    navigator.credentials.create({ "publicKey": publicKeyCredentialCreationOptions })
      .then((newCredentialInfo: any) => {
        alert('Open your browser console!')
        // PublicKeyCredential object is returned by the WebAuthn API.
        console.log('SUCCESS', newCredentialInfo)
        console.log('ClientDataJSON: ',  JSON.parse(bufferToString(newCredentialInfo.response.clientDataJSON)) )
        // console.log('AttestationObject: ', bufferToString(newCredentialInfo.response.attestationObject))
        let attestationObjectBuffer = window.btoa(newCredentialInfo.response.attestationObject);
        let ctapMakeCredResp = window.atob(attestationObjectBuffer);;
        console.log("ctapMakeCredResp", ctapMakeCredResp);
       


        // let authData = parseAuthData(attestationObject.authData);
        // console.log('AuthData: ', authData);
        // console.log('CredID: ', bufToHex(authData.credID));
        // console.log('AAGUID: ', bufToHex(authData.aaguid));
        // console.log('PublicKey', CBOR.decode(authData.COSEPublicKey.buffer));
      })
      .catch((error) => {
        alert('Open your browser console!')
        console.log('FAIL', error)
        if (error.message === "No device selected") {
          alert("Fingerprint authentication is not available on this device");
        } else {
          // handle other errors
        }
      })
  }

}


var bufferToString = (buff: any) => {
  var enc = new TextDecoder(); // always utf-8
  return enc.decode(buff)
}




// The publicKeyCredentialCreationOptions object is created by the server and sent to the client (browser) as part of the Web Authentication (WebAuthn) protocol.
// The server defines the parameters of the publicKeyCredentialCreationOptions object based on its requirements and sends it to the client as a challenge. The client uses this challenge to create a new credential, which is then sent back to the server for verification.




