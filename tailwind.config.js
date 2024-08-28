const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const colorShades = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900'
]

function toColorMap(name, colorGroup) {
  return colorShades.reduce((map, shade) => {
    map[`${name}-${shade}`] = colorGroup[shade]
    return map
  }, {})
}

const primary = {
  ...colors.emerald,
  500: '#00E2AC',
  700: '#00CE9D'
}
const neutral = colors.gray
const accent = { ...colors.sky, 800: '#091B2C' }

const white = '#fff'
const sidebarBg = '#2f2c65'
const qonicMoon = '#000B16'
const qonicBlack = '#091B2C'

module.exports = {
  content: [
    './src/**/*.{js,jsx,tx,tsx}',
    './index.html',
    './src/components/*.{js,jsx,,ts,tsx}',
    './src/utils/*.{js,jsx,,ts,tsx}'
  ],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        tiny: '.625rem'
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      lineHeight: {
        3.5: '.875rem'
      },
      backgroundImage: (theme) => ({
        'login-image': "url('~/assets/bg-login.jpg')"
      }),
      colors: {
        ...toColorMap('primary', primary),
        ...toColorMap('neutral', neutral),
        ...toColorMap('accent', accent),
        'color-primary': neutral['900'],
        'color-primary-inverse': neutral['50'],

        'app-bg': white,
        'app-sidebar-bg': qonicBlack,
        'sidebar-text': white,

        'button-primary': primary['600'],
        'button-primary-hover': primary['700'],
        'button-primary-focus-ring': primary['500'],
        'button-primary-label': white,

        'button-secondary': primary['100'],
        'button-secondary-hover': primary['200'],
        'button-secondary-focus-ring': primary['500'],
        'button-secondary-label': primary['700'],

        'checkbox-primary': primary['600'],
        'checkbox-primary-focus-ring': primary['500'],
        'checkbox-primary-border': neutral['300'],
        'checkbox-primary-label': neutral['900'],
        'checkbox-primary-description': neutral['700'],

        'input-bg': white,
        'input-bg-focus': neutral['100'],
        'input-border': neutral['500'],
        'input-border-focus': primary['300'],
        'input-text': neutral['900'],
        'input-placeholder': neutral['600'],
        'input-ring': primary['500'],

        'form-element-ring': primary['600'],
        'form-element-ring-offset': white,

        'menu-bg': neutral['200'],
        'menu-divider': neutral['300'],
        'menu-hover-bg': neutral['300'],

        'option-active-bg': neutral['200'],
        'option-active-text': neutral['800'],

        'card-bg': sidebarBg,

        'toggle-inactive': colors.gray['200'],
        'toggle-active': primary['500'],
        'toggle-switch': neutral['900'],
        'toggle-ring': accent['700'],

        'dark-active-bg': qonicMoon,
        'dark-bg': qonicBlack,
        'accent-red': '#FA5457',
        'accent-orange': '#FDC652',
        'qonic-black': '#09212C',
        'qonic-black-hover': '#223A51',
        'qonic-gray-hover': '#E2E8F0',
        'qonic-gray-400': '#848D95'
      },
      borderWidth: {
        1: '1px'
      },
      boxShadow: {
        qonic: '0px 0px 8px 0px rgba(9, 33, 44, 0.12)'
      },
      ringWidth: {
        3: '3px'
      },
      ringOffsetWidth: {
        3: '3px'
      },
      transitionProperty: {
        width: 'width',
        margin: 'margin'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    plugin(function ({ addUtilities }) {
      const utilities = {
        '.center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }
      addUtilities(utilities)
    })
  ]
}
