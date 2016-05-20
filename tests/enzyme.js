import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'
const { describe, it } = global
import td from 'testdouble'
import { _ } from 'underscore';


// ==================
// Use testdouble to stub in magical meteor imports
const SimpleSchema = () => ({ validator: td.function() })
SimpleSchema.RegEx = { Id: null }
const ValidatedMethod = () => td.function()
const TAPi18n = { __: _.identity }
const Meteor = td.object(['userId'])
const DDPRateLimiter = td.function()
const Mongo = { Collection: () => td.object(['deny', 'attachSchema', 'helpers']) }
const Factory = { create: td.function(), define: td.function() }
const check = td.function()

td.replace('meteor/underscore', { _ })
td.replace('meteor/tap:i18n', { TAPi18n })
td.replace('meteor/meteor', { Meteor })
td.replace('meteor/mdg:validated-method', { ValidatedMethod })
td.replace('meteor/aldeed:simple-schema', { SimpleSchema })
td.replace('meteor/ddp-rate-limiter', { DDPRateLimiter })
td.replace('meteor/mongo', { Mongo })
td.replace('meteor/factory', { Factory })
td.replace('meteor/check', { check })
// ==================

// Use require to import TodoItem per @smeijer's suggestion
// https://forums.meteor.com/t/meteor-1-3-testing-with-meteor-meteor-x-package-imports/21009
const TodoItem = require('../imports/ui/components/TodoItem').default

describe('TodoItem', () => {
  it('should render', () => {
    const todo = { text: "testing", checked: false, createdAt: new Date('2016-01-01') }
    const item = shallow(<TodoItem todo={todo} />)
    expect(item).to.have.className('list-item')
  })
})
