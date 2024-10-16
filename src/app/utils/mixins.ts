import styled, {css} from 'styled-components'
import { TRANS_TIME } from '../global/theme'

export const HiddenInput = styled.input`
    display: none;
`

const shadowStandardValue = '0 0 5px 2px rgba(0, 0, 0, 0.08)' 

const shadowStandard = css`
    box-shadow: ${shadowStandardValue};
`

const fontNormal = css`
    font-weight: 600
`

const fontBold = css`
    font-weight: 800;
`

const fontLight = css`
    font-weight: 300;
`

const textNormal = css`
    font-size: 1.4rem;
`

const textNormalDetail = css`
    font-size: 1.6rem;
`

const blockMargin = css`
    margin-top: 0;
    margin-bottom: 100px;
`

const hoverFadeOut = css`
    transition: opacity ${TRANS_TIME} ease;
    opacity: 1;

    @media (hover: hover) {
        &:hover {
            opacity: 0.7
        }
    };

    &:focus-visible {
        opacity: 0.7;
    }
`

const hoverShadow = css`
    transition: box-shadow ${TRANS_TIME} ease;
    ${shadowStandard};

    @media (hover: hover) {
        &:hover {
            box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.2);
        }
    };

    &:focus-visible {
        box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.2);
    }
`

const shadowAndOpacity = css`
    transition: opacity ${TRANS_TIME} ease, box-shadow ${TRANS_TIME} ease;
    ${shadowStandard};
    opacity: 1;
    
    @media (hover: hover) {
        &:hover {
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
            opacity: 0.7;
        }
    };

    &:focus-visible {
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
        opacity: 0.7;
    }
`

const transitionRules = css`
    transition: opacity 0.4s ease, translate 0.4s ease;
`

const visuallyHidden = css`
    position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
    
      white-space: nowrap;
    
      border: 0;
    
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
`

export {fontNormal, fontLight, textNormal, transitionRules, shadowAndOpacity, textNormalDetail, fontBold, blockMargin, hoverShadow, hoverFadeOut, visuallyHidden, shadowStandard, shadowStandardValue}