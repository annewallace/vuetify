export default {
  data () {
    return {
      errors: [],
      focused: false,
      lazyValue: this.value,
      appendIconAlt: '',
      prependIconAlt: '',
      appendIconCbPrivate: null,
      prependIconCbPrivate: null
    }
  },

  props: {
    appendIcon: String,
    appendIconCb: Function,
    dark: Boolean,
    disabled: Boolean,
    hint: String,
    persistentHint: Boolean,
    label: String,
    light: {
      type: Boolean,
      default: true
    },
    prependIcon: String,
    prependIconCb: Function,
    required: Boolean,
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      required: false
    }
  },

  computed: {
    hasError () {
      return this.errors.length !== 0
    },
    inputGroupClasses () {
      return Object.assign({
        'input-group': true,
        'input-group--focused': this.focused,
        'input-group--dirty': this.isDirty,
        'input-group--disabled': this.disabled,
        'input-group--light': this.light && !this.dark,
        'input-group--dark': this.dark,
        'input-group--error': this.hasError || this.errors.length > 0,
        'input-group--append-icon': this.appendIcon,
        'input-group--prepend-icon': this.prependIcon,
        'input-group--required': this.required
      }, this.classes)
    },
    isDirty () {
      return this.inputValue
    },
    modifiers () {
      const modifiers = {
        lazy: false,
        number: false,
        trim: false
      }

      if (!this.$vnode.data.directives) {
        return modifiers
      }

      const model = this.$vnode.data.directives.find(i => i.name === 'model')

      if (!model) {
        return modifiers
      }

      return Object.assign(modifiers, model.modifiers)
    }
  },

  mounted () {
    this.validate()
  },

  methods: {
    genLabel () {
      return this.$createElement('label', {}, this.label)
    },
    genMessages () {
      let messages = []

      if ((this.hint &&
            this.focused ||
            this.hint &&
            this.persistentHint) &&
          this.errors.length === 0
      ) {
        messages = [this.genHint()]
      } else if (this.errors.length) {
        messages = this.errors.map(i => this.genError(i))
      }

      return this.$createElement(
        'transition-group',
        {
          'class': {
            'input-group__messages': true
          },
          props: {
            tag: 'div',
            name: 'slide-y-transition'
          }
        },
        messages
      )
    },
    genHint () {
      return this.$createElement('div', {
        'class': 'input-group__hint',
        key: this.hint
      }, this.hint)
    },
    genError (error) {
      return this.$createElement(
        'div',
        {
          'class': 'input-group__error',
          key: error
        },
        error
      )
    },
    genIcon (type) {
      const icon = this[`${type}IconAlt`] || this[`${type}Icon`]
      const callback = this[`${type}IconCb`]
      const callbackPrivate = this[`${type}IconCbPrivate`]

      return this.$createElement(
        'v-icon',
        {
          'class': 'input-group__' + type + '-icon',
          'nativeOn': {
            'click': e => {
              if (typeof callbackPrivate === 'function') callbackPrivate(e)
              if (typeof callback === 'function') callback(e)
            }
          }
        },
        icon
      )
    },
    genInputGroup (input, data = {}) {
      const children = []
      const wrapperChildren = []
      const detailsChildren = []

      data = Object.assign(data, {
        'class': this.inputGroupClasses
      })

      if (this.label) {
        children.push(this.genLabel())
      }

      wrapperChildren.push(input)

      if (this.prependIcon) {
        wrapperChildren.unshift(this.genIcon('prepend'))
      }

      if (this.appendIcon) {
        wrapperChildren.push(this.genIcon('append'))
      }

      children.push(
        this.$createElement('div', {
          'class': 'input-group__input'
        }, wrapperChildren)
      )

      if (this.errors.length > 0 || this.hint) {
        detailsChildren.push(this.genMessages())
      }

      if (this.counter) {
        detailsChildren.push(this.genCounter())
      }

      children.push(
        this.$createElement('div', {
          'class': 'input-group__details'
        }, detailsChildren)
      )

      return this.$createElement('div', data, children)
    },
    validate () {
      this.errors = []

      this.rules.forEach(rule => {
        const valid = rule(this.value)

        if (valid !== true) {
          this.errors.push(valid)
        }
      })
    }
  }
}