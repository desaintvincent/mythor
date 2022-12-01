(self["webpackChunk_mythor_examples"] = self["webpackChunk_mythor_examples"] || []).push([["scene"],{

/***/ "../../node_modules/planck-js/lib/Body.js":
/*!************************************************!*\
  !*** ../../node_modules/planck-js/lib/Body.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Body;

var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ./util/options */ "../../node_modules/planck-js/lib/util/options.js");

var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ./common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Sweep = __webpack_require__(/*! ./common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ./common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ./common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ./common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Fixture = __webpack_require__(/*! ./Fixture */ "../../node_modules/planck-js/lib/Fixture.js");
var Shape = __webpack_require__(/*! ./Shape */ "../../node_modules/planck-js/lib/Shape.js");

var staticBody = Body.STATIC = 'static';
var kinematicBody = Body.KINEMATIC = 'kinematic';
var dynamicBody = Body.DYNAMIC = 'dynamic';

/**
 * @typedef {Object} BodyDef
 *
 * @prop type Body types are static, kinematic, or dynamic. Note: if a dynamic
 *       body would have zero mass, the mass is set to one.
 *
 * @prop position The world position of the body. Avoid creating bodies at the
 *       origin since this can lead to many overlapping shapes.
 *
 * @prop angle The world angle of the body in radians.
 *
 * @prop linearVelocity The linear velocity of the body's origin in world
 *       co-ordinates.
 *
 * @prop angularVelocity
 *
 * @prop linearDamping Linear damping is use to reduce the linear velocity. The
 *       damping parameter can be larger than 1.0 but the damping effect becomes
 *       sensitive to the time step when the damping parameter is large.
 *
 * @prop angularDamping Angular damping is use to reduce the angular velocity.
 *       The damping parameter can be larger than 1.0 but the damping effect
 *       becomes sensitive to the time step when the damping parameter is large.
 *
 * @prop fixedRotation Should this body be prevented from rotating? Useful for
 *       characters.
 *
 * @prop bullet Is this a fast moving body that should be prevented from
 *       tunneling through other moving bodies? Note that all bodies are
 *       prevented from tunneling through kinematic and static bodies. This
 *       setting is only considered on dynamic bodies. Warning: You should use
 *       this flag sparingly since it increases processing time.
 *
 * @prop active Does this body start out active?
 *
 * @prop awake Is this body initially awake or sleeping?
 *
 * @prop allowSleep Set this flag to false if this body should never fall
 *       asleep. Note that this increases CPU usage.
 */
var BodyDef = {
  type : staticBody,
  position : Vec2.zero(),
  angle : 0.0,

  linearVelocity : Vec2.zero(),
  angularVelocity : 0.0,

  linearDamping : 0.0,
  angularDamping : 0.0,

  fixedRotation : false,
  bullet : false,
  gravityScale : 1.0,

  allowSleep : true,
  awake : true,
  active : true,

  userData : null
};

/**
 * @class
 * 
 * A rigid body composed of one or more fixtures.
 * 
 * @param {World} world
 * @param {BodyDef} def
 */
function Body(world, def) {

  def = options(def, BodyDef);

  _ASSERT && common.assert(Vec2.isValid(def.position));
  _ASSERT && common.assert(Vec2.isValid(def.linearVelocity));
  _ASSERT && common.assert(Math.isFinite(def.angle));
  _ASSERT && common.assert(Math.isFinite(def.angularVelocity));
  _ASSERT && common.assert(Math.isFinite(def.angularDamping) && def.angularDamping >= 0.0);
  _ASSERT && common.assert(Math.isFinite(def.linearDamping) && def.linearDamping >= 0.0);

  this.m_world = world;

  this.m_awakeFlag = def.awake;
  this.m_autoSleepFlag = def.allowSleep;
  this.m_bulletFlag = def.bullet;
  this.m_fixedRotationFlag = def.fixedRotation;
  this.m_activeFlag = def.active;

  this.m_islandFlag = false;
  this.m_toiFlag = false;

  this.m_userData = def.userData;
  this.m_type = def.type;

  if (this.m_type == dynamicBody) {
    this.m_mass = 1.0;
    this.m_invMass = 1.0;
  } else {
    this.m_mass = 0.0;
    this.m_invMass = 0.0;
  }

  // Rotational inertia about the center of mass.
  this.m_I = 0.0;
  this.m_invI = 0.0;

  // the body origin transform
  this.m_xf = Transform.identity();
  this.m_xf.p = Vec2.clone(def.position);
  this.m_xf.q.setAngle(def.angle);

  // the swept motion for CCD
  this.m_sweep = new Sweep();
  this.m_sweep.setTransform(this.m_xf);

  // position and velocity correction
  this.c_velocity = new Velocity();
  this.c_position = new Position();

  this.m_force = Vec2.zero();
  this.m_torque = 0.0;

  this.m_linearVelocity = Vec2.clone(def.linearVelocity);
  this.m_angularVelocity = def.angularVelocity;

  this.m_linearDamping = def.linearDamping;
  this.m_angularDamping = def.angularDamping;
  this.m_gravityScale = def.gravityScale;

  this.m_sleepTime = 0.0;

  this.m_jointList = null;
  this.m_contactList = null;
  this.m_fixtureList = null;

  this.m_prev = null;
  this.m_next = null;

  this.m_destroyed = false;
}

Body.prototype._serialize = function() {
  var fixtures = [];
  for (var f = this.m_fixtureList; f; f = f.m_next) {
    fixtures.push(f);
  }
  return {
    type: this.m_type,
    bullet: this.m_bulletFlag,
    position: this.m_xf.p,
    angle: this.m_xf.q.getAngle(),
    linearVelocity: this.m_linearVelocity,
    angularVelocity: this.m_angularVelocity,
    fixtures: fixtures,
  };
};

Body._deserialize = function(data, world, restore) {
  var body = new Body(world, data);

  if (data.fixtures) {
    for (var i = data.fixtures.length - 1; i >= 0; i--) {
      var fixture = restore(Fixture, data.fixtures[i], body);
      body._addFixture(fixture);
    }
  }
  return body;
};

Body.prototype.isWorldLocked = function() {
  return this.m_world && this.m_world.isLocked() ? true : false;
};

Body.prototype.getWorld = function() {
  return this.m_world;
};

Body.prototype.getNext = function() {
  return this.m_next;
};

Body.prototype.setUserData = function(data) {
  this.m_userData = data;
};

Body.prototype.getUserData = function() {
  return this.m_userData;
};

Body.prototype.getFixtureList = function() {
  return this.m_fixtureList;
};

Body.prototype.getJointList = function() {
  return this.m_jointList;
};

/**
 * Warning: this list changes during the time step and you may miss some
 * collisions if you don't use ContactListener.
 */
Body.prototype.getContactList = function() {
  return this.m_contactList;
};

Body.prototype.isStatic = function() {
  return this.m_type == staticBody;
};

Body.prototype.isDynamic = function() {
  return this.m_type == dynamicBody;
};

Body.prototype.isKinematic = function() {
  return this.m_type == kinematicBody;
};

/**
 * This will alter the mass and velocity.
 */
Body.prototype.setStatic = function() {
  this.setType(staticBody);
  return this;
};

Body.prototype.setDynamic = function() {
  this.setType(dynamicBody);
  return this;
};

Body.prototype.setKinematic = function() {
  this.setType(kinematicBody);
  return this;
};

/**
 * @private
 */
Body.prototype.getType = function() {
  return this.m_type;
};

/**
 * 
 * @private
 */
Body.prototype.setType = function(type) {
  _ASSERT && common.assert(type === staticBody || type === kinematicBody || type === dynamicBody);
  _ASSERT && common.assert(this.isWorldLocked() == false);

  if (this.isWorldLocked() == true) {
    return;
  }

  if (this.m_type == type) {
    return;
  }

  this.m_type = type;

  this.resetMassData();

  if (this.m_type == staticBody) {
    this.m_linearVelocity.setZero();
    this.m_angularVelocity = 0.0;
    this.m_sweep.forward();
    this.synchronizeFixtures();
  }

  this.setAwake(true);

  this.m_force.setZero();
  this.m_torque = 0.0;

  // Delete the attached contacts.
  var ce = this.m_contactList;
  while (ce) {
    var ce0 = ce;
    ce = ce.next;
    this.m_world.destroyContact(ce0.contact);
  }
  this.m_contactList = null;

  // Touch the proxies so that new contacts will be created (when appropriate)
  var broadPhase = this.m_world.m_broadPhase;
  for (var f = this.m_fixtureList; f; f = f.m_next) {
    var proxyCount = f.m_proxyCount;
    for (var i = 0; i < proxyCount; ++i) {
      broadPhase.touchProxy(f.m_proxies[i].proxyId);
    }
  }
};

Body.prototype.isBullet = function() {
  return this.m_bulletFlag;
};

/**
 * Should this body be treated like a bullet for continuous collision detection?
 */
Body.prototype.setBullet = function(flag) {
  this.m_bulletFlag = !!flag;
};

Body.prototype.isSleepingAllowed = function() {
  return this.m_autoSleepFlag;
};

Body.prototype.setSleepingAllowed = function(flag) {
  this.m_autoSleepFlag = !!flag;
  if (this.m_autoSleepFlag == false) {
    this.setAwake(true);
  }
};

Body.prototype.isAwake = function() {
  return this.m_awakeFlag;
};

/**
 * Set the sleep state of the body. A sleeping body has very low CPU cost.
 * 
 * @param flag Set to true to wake the body, false to put it to sleep.
 */
Body.prototype.setAwake = function(flag) {
  if (flag) {
    if (this.m_awakeFlag == false) {
      this.m_awakeFlag = true;
      this.m_sleepTime = 0.0;
    }
  } else {
    this.m_awakeFlag = false;
    this.m_sleepTime = 0.0;
    this.m_linearVelocity.setZero();
    this.m_angularVelocity = 0.0;
    this.m_force.setZero();
    this.m_torque = 0.0;
  }
};

Body.prototype.isActive = function() {
  return this.m_activeFlag;
};

/**
 * Set the active state of the body. An inactive body is not simulated and
 * cannot be collided with or woken up. If you pass a flag of true, all fixtures
 * will be added to the broad-phase. If you pass a flag of false, all fixtures
 * will be removed from the broad-phase and all contacts will be destroyed.
 * Fixtures and joints are otherwise unaffected.
 * 
 * You may continue to create/destroy fixtures and joints on inactive bodies.
 * Fixtures on an inactive body are implicitly inactive and will not participate
 * in collisions, ray-casts, or queries. Joints connected to an inactive body
 * are implicitly inactive. An inactive body is still owned by a World object
 * and remains
 */
Body.prototype.setActive = function(flag) {
  _ASSERT && common.assert(this.isWorldLocked() == false);

  if (flag == this.m_activeFlag) {
    return;
  }

  this.m_activeFlag = !!flag;

  if (this.m_activeFlag) {
    // Create all proxies.
    var broadPhase = this.m_world.m_broadPhase;
    for (var f = this.m_fixtureList; f; f = f.m_next) {
      f.createProxies(broadPhase, this.m_xf);
    }
    // Contacts are created the next time step.

  } else {
    // Destroy all proxies.
    var broadPhase = this.m_world.m_broadPhase;
    for (var f = this.m_fixtureList; f; f = f.m_next) {
      f.destroyProxies(broadPhase);
    }

    // Destroy the attached contacts.
    var ce = this.m_contactList;
    while (ce) {
      var ce0 = ce;
      ce = ce.next;
      this.m_world.destroyContact(ce0.contact);
    }
    this.m_contactList = null;
  }
};

Body.prototype.isFixedRotation = function() {
  return this.m_fixedRotationFlag;
};

/**
 * Set this body to have fixed rotation. This causes the mass to be reset.
 */
Body.prototype.setFixedRotation = function(flag) {
  if (this.m_fixedRotationFlag == flag) {
    return;
  }

  this.m_fixedRotationFlag = !!flag;

  this.m_angularVelocity = 0.0;

  this.resetMassData();
};

/**
 * Get the world transform for the body's origin.
 */
Body.prototype.getTransform = function() {
  return this.m_xf;
};

/**
 * Set the position of the body's origin and rotation. Manipulating a body's
 * transform may cause non-physical behavior. Note: contacts are updated on the
 * next call to World.step.
 * 
 * @param position The world position of the body's local origin.
 * @param angle The world rotation in radians.
 */
Body.prototype.setTransform = function(position, angle) {
  _ASSERT && common.assert(this.isWorldLocked() == false);
  if (this.isWorldLocked() == true) {
    return;
  }

  this.m_xf.set(position, angle);
  this.m_sweep.setTransform(this.m_xf);

  var broadPhase = this.m_world.m_broadPhase;
  for (var f = this.m_fixtureList; f; f = f.m_next) {
    f.synchronize(broadPhase, this.m_xf, this.m_xf);
  }
};

Body.prototype.synchronizeTransform = function() {
  this.m_sweep.getTransform(this.m_xf, 1);
};

/**
 * Update fixtures in broad-phase.
 */
Body.prototype.synchronizeFixtures = function() {
  var xf = Transform.identity();

  this.m_sweep.getTransform(xf, 0);

  var broadPhase = this.m_world.m_broadPhase;
  for (var f = this.m_fixtureList; f; f = f.m_next) {
    f.synchronize(broadPhase, xf, this.m_xf);
  }
};

/**
 * Used in TOI.
 */
Body.prototype.advance = function(alpha) {
  // Advance to the new safe time. This doesn't sync the broad-phase.
  this.m_sweep.advance(alpha);
  this.m_sweep.c.set(this.m_sweep.c0);
  this.m_sweep.a = this.m_sweep.a0;
  this.m_sweep.getTransform(this.m_xf, 1);
};

/**
 * Get the world position for the body's origin.
 */
Body.prototype.getPosition = function() {
  return this.m_xf.p;
};

Body.prototype.setPosition = function(p) {
  this.setTransform(p, this.m_sweep.a);
};

/**
 * Get the current world rotation angle in radians.
 */
Body.prototype.getAngle = function() {
  return this.m_sweep.a;
};

Body.prototype.setAngle = function(angle) {
  this.setTransform(this.m_xf.p, angle);
};

/**
 * Get the world position of the center of mass.
 */
Body.prototype.getWorldCenter = function() {
  return this.m_sweep.c;
};

/**
 * Get the local position of the center of mass.
 */
Body.prototype.getLocalCenter = function() {
  return this.m_sweep.localCenter;
};

/**
 * Get the linear velocity of the center of mass.
 * 
 * @return the linear velocity of the center of mass.
 */
Body.prototype.getLinearVelocity = function() {
  return this.m_linearVelocity;
};

/**
 * Get the world linear velocity of a world point attached to this body.
 * 
 * @param worldPoint A point in world coordinates.
 */
Body.prototype.getLinearVelocityFromWorldPoint = function(worldPoint) {
  var localCenter = Vec2.sub(worldPoint, this.m_sweep.c);
  return Vec2.add(this.m_linearVelocity, Vec2.cross(this.m_angularVelocity,
      localCenter));
};

/**
 * Get the world velocity of a local point.
 * 
 * @param localPoint A point in local coordinates.
 */
Body.prototype.getLinearVelocityFromLocalPoint = function(localPoint) {
  return this.getLinearVelocityFromWorldPoint(this.getWorldPoint(localPoint));
};

/**
 * Set the linear velocity of the center of mass.
 * 
 * @param v The new linear velocity of the center of mass.
 */
Body.prototype.setLinearVelocity = function(v) {
  if (this.m_type == staticBody) {
    return;
  }
  if (Vec2.dot(v, v) > 0.0) {
    this.setAwake(true);
  }
  this.m_linearVelocity.set(v);
};

/**
 * Get the angular velocity.
 * 
 * @returns the angular velocity in radians/second.
 */
Body.prototype.getAngularVelocity = function() {
  return this.m_angularVelocity;
};

/**
 * Set the angular velocity.
 * 
 * @param omega The new angular velocity in radians/second.
 */
Body.prototype.setAngularVelocity = function(w) {
  if (this.m_type == staticBody) {
    return;
  }
  if (w * w > 0.0) {
    this.setAwake(true);
  }
  this.m_angularVelocity = w;
};

Body.prototype.getLinearDamping = function() {
  return this.m_linearDamping;
};

Body.prototype.setLinearDamping = function(linearDamping) {
  this.m_linearDamping = linearDamping;
};

Body.prototype.getAngularDamping = function() {
  return this.m_angularDamping;
};

Body.prototype.setAngularDamping = function(angularDamping) {
  this.m_angularDamping = angularDamping;
};

Body.prototype.getGravityScale = function() {
  return this.m_gravityScale;
};

/**
 * Scale the gravity applied to this body.
 */
Body.prototype.setGravityScale = function(scale) {
  this.m_gravityScale = scale;
};

/**
 * Get the total mass of the body.
 * 
 * @returns The mass, usually in kilograms (kg).
 */
Body.prototype.getMass = function() {
  return this.m_mass;
};

/**
 * Get the rotational inertia of the body about the local origin.
 * 
 * @return the rotational inertia, usually in kg-m^2.
 */
Body.prototype.getInertia = function() {
  return this.m_I + this.m_mass
      * Vec2.dot(this.m_sweep.localCenter, this.m_sweep.localCenter);
};

/**
 * @typedef {Object} MassData This holds the mass data computed for a shape.
 * 
 * @prop mass The mass of the shape, usually in kilograms.
 * @prop center The position of the shape's centroid relative to the shape's
 *       origin.
 * @prop I The rotational inertia of the shape about the local origin.
 */
function MassData() {
  this.mass = 0;
  this.center = Vec2.zero();
  this.I = 0;
};

/**
 * Copy the mass data of the body to data.
 */
Body.prototype.getMassData = function(data) {
  data.mass = this.m_mass;
  data.I = this.getInertia();
  data.center.set(this.m_sweep.localCenter);
};

/**
 * This resets the mass properties to the sum of the mass properties of the
 * fixtures. This normally does not need to be called unless you called
 * SetMassData to override the mass and you later want to reset the mass.
 */
Body.prototype.resetMassData = function() {
  // Compute mass data from shapes. Each shape has its own density.
  this.m_mass = 0.0;
  this.m_invMass = 0.0;
  this.m_I = 0.0;
  this.m_invI = 0.0;
  this.m_sweep.localCenter.setZero();

  // Static and kinematic bodies have zero mass.
  if (this.isStatic() || this.isKinematic()) {
    this.m_sweep.c0.set(this.m_xf.p);
    this.m_sweep.c.set(this.m_xf.p);
    this.m_sweep.a0 = this.m_sweep.a;
    return;
  }

  _ASSERT && common.assert(this.isDynamic());

  // Accumulate mass over all fixtures.
  var localCenter = Vec2.zero();
  for (var f = this.m_fixtureList; f; f = f.m_next) {
    if (f.m_density == 0.0) {
      continue;
    }

    var massData = new MassData();
    f.getMassData(massData);
    this.m_mass += massData.mass;
    localCenter.addMul(massData.mass, massData.center);
    this.m_I += massData.I;
  }

  // Compute center of mass.
  if (this.m_mass > 0.0) {
    this.m_invMass = 1.0 / this.m_mass;
    localCenter.mul(this.m_invMass);

  } else {
    // Force all dynamic bodies to have a positive mass.
    this.m_mass = 1.0;
    this.m_invMass = 1.0;
  }

  if (this.m_I > 0.0 && this.m_fixedRotationFlag == false) {
    // Center the inertia about the center of mass.
    this.m_I -= this.m_mass * Vec2.dot(localCenter, localCenter);
    _ASSERT && common.assert(this.m_I > 0.0);
    this.m_invI = 1.0 / this.m_I;

  } else {
    this.m_I = 0.0;
    this.m_invI = 0.0;
  }

  // Move center of mass.
  var oldCenter = Vec2.clone(this.m_sweep.c);
  this.m_sweep.setLocalCenter(localCenter, this.m_xf);

  // Update center of mass velocity.
  this.m_linearVelocity.add(Vec2.cross(this.m_angularVelocity, Vec2.sub(
      this.m_sweep.c, oldCenter)));
};

/**
 * Set the mass properties to override the mass properties of the fixtures. Note
 * that this changes the center of mass position. Note that creating or
 * destroying fixtures can also alter the mass. This function has no effect if
 * the body isn't dynamic.
 * 
 * @param massData The mass properties.
 */
Body.prototype.setMassData = function(massData) {
  _ASSERT && common.assert(this.isWorldLocked() == false);
  if (this.isWorldLocked() == true) {
    return;
  }

  if (this.m_type != dynamicBody) {
    return;
  }

  this.m_invMass = 0.0;
  this.m_I = 0.0;
  this.m_invI = 0.0;

  this.m_mass = massData.mass;
  if (this.m_mass <= 0.0) {
    this.m_mass = 1.0;
  }

  this.m_invMass = 1.0 / this.m_mass;

  if (massData.I > 0.0 && this.m_fixedRotationFlag == false) {
    this.m_I = massData.I - this.m_mass
        * Vec2.dot(massData.center, massData.center);
    _ASSERT && common.assert(this.m_I > 0.0);
    this.m_invI = 1.0 / this.m_I;
  }

  // Move center of mass.
  var oldCenter = Vec2.clone(this.m_sweep.c);
  this.m_sweep.setLocalCenter(massData.center, this.m_xf);

  // Update center of mass velocity.
  this.m_linearVelocity.add(Vec2.cross(this.m_angularVelocity, Vec2.sub(
      this.m_sweep.c, oldCenter)));
};

/**
 * Apply a force at a world point. If the force is not applied at the center of
 * mass, it will generate a torque and affect the angular velocity. This wakes
 * up the body.
 * 
 * @param force The world force vector, usually in Newtons (N).
 * @param point The world position of the point of application.
 * @param wake Also wake up the body
 */
Body.prototype.applyForce = function(force, point, wake) {
  if (this.m_type != dynamicBody) {
    return;
  }
  if (wake && this.m_awakeFlag == false) {
    this.setAwake(true);
  }
  // Don't accumulate a force if the body is sleeping.
  if (this.m_awakeFlag) {
    this.m_force.add(force);
    this.m_torque += Vec2.cross(Vec2.sub(point, this.m_sweep.c), force);
  }
};

/**
 * Apply a force to the center of mass. This wakes up the body.
 * 
 * @param force The world force vector, usually in Newtons (N).
 * @param wake Also wake up the body
 */
Body.prototype.applyForceToCenter = function(force, wake) {
  if (this.m_type != dynamicBody) {
    return;
  }
  if (wake && this.m_awakeFlag == false) {
    this.setAwake(true);
  }
  // Don't accumulate a force if the body is sleeping
  if (this.m_awakeFlag) {
    this.m_force.add(force);
  }
};

/**
 * Apply a torque. This affects the angular velocity without affecting the
 * linear velocity of the center of mass. This wakes up the body.
 * 
 * @param torque About the z-axis (out of the screen), usually in N-m.
 * @param wake Also wake up the body
 */
Body.prototype.applyTorque = function(torque, wake) {
  if (this.m_type != dynamicBody) {
    return;
  }
  if (wake && this.m_awakeFlag == false) {
    this.setAwake(true);
  }
  // Don't accumulate a force if the body is sleeping
  if (this.m_awakeFlag) {
    this.m_torque += torque;
  }
};

/**
 * Apply an impulse at a point. This immediately modifies the velocity. It also
 * modifies the angular velocity if the point of application is not at the
 * center of mass. This wakes up the body.
 * 
 * @param impulse The world impulse vector, usually in N-seconds or kg-m/s.
 * @param point The world position of the point of application.
 * @param wake Also wake up the body
 */
Body.prototype.applyLinearImpulse = function(impulse, point, wake) {
  if (this.m_type != dynamicBody) {
    return;
  }
  if (wake && this.m_awakeFlag == false) {
    this.setAwake(true);
  }

  // Don't accumulate velocity if the body is sleeping
  if (this.m_awakeFlag) {
    this.m_linearVelocity.addMul(this.m_invMass, impulse);
    this.m_angularVelocity += this.m_invI * Vec2.cross(Vec2.sub(point, this.m_sweep.c), impulse);
  }
};

/**
 * Apply an angular impulse.
 * 
 * @param impulse The angular impulse in units of kg*m*m/s
 * @param wake Also wake up the body
 */
Body.prototype.applyAngularImpulse = function(impulse, wake) {
  if (this.m_type != dynamicBody) {
    return;
  }

  if (wake && this.m_awakeFlag == false) {
    this.setAwake(true);
  }
  // Don't accumulate velocity if the body is sleeping
  if (this.m_awakeFlag) {
    this.m_angularVelocity += this.m_invI * impulse;
  }
};

/**
 * This is used to prevent connected bodies (by joints) from colliding,
 * depending on the joint's collideConnected flag.
 */
Body.prototype.shouldCollide = function(that) {
  // At least one body should be dynamic.
  if (this.m_type != dynamicBody && that.m_type != dynamicBody) {
    return false;
  }
  // Does a joint prevent collision?
  for (var jn = this.m_jointList; jn; jn = jn.next) {
    if (jn.other == that) {
      if (jn.joint.m_collideConnected == false) {
        return false;
      }
    }
  }
  return true;
};

/**
 * @internal Used for deserialize.
 */
Body.prototype._addFixture = function(fixture) {
  _ASSERT && common.assert(this.isWorldLocked() == false);

  if (this.isWorldLocked() == true) {
    return null;
  }

  if (this.m_activeFlag) {
    var broadPhase = this.m_world.m_broadPhase;
    fixture.createProxies(broadPhase, this.m_xf);
  }

  fixture.m_next = this.m_fixtureList;
  this.m_fixtureList = fixture;

  // Adjust mass properties if needed.
  if (fixture.m_density > 0.0) {
    this.resetMassData();
  }

  // Let the world know we have a new fixture. This will cause new contacts
  // to be created at the beginning of the next time step.
  this.m_world.m_newFixture = true;

  return fixture
};

/**
 * Creates a fixture and attach it to this body.
 * 
 * If the density is non-zero, this function automatically updates the mass of
 * the body.
 * 
 * Contacts are not created until the next time step.
 * 
 * Warning: This function is locked during callbacks.

 * @param {Shape|FixtureDef} shape Shape or fixture definition.
 * @param {FixtureDef|number} fixdef Fixture definition or just density.
 */
Body.prototype.createFixture = function(shape, fixdef) {
  _ASSERT && common.assert(this.isWorldLocked() == false);

  if (this.isWorldLocked() == true) {
    return null;
  }

  var fixture = new Fixture(this, shape, fixdef);
  this._addFixture(fixture);
  return fixture
};

/**
 * Destroy a fixture. This removes the fixture from the broad-phase and destroys
 * all contacts associated with this fixture. This will automatically adjust the
 * mass of the body if the body is dynamic and the fixture has positive density.
 * All fixtures attached to a body are implicitly destroyed when the body is
 * destroyed.
 * 
 * Warning: This function is locked during callbacks.
 * 
 * @param fixture The fixture to be removed.
 */
Body.prototype.destroyFixture = function(fixture) {
  _ASSERT && common.assert(this.isWorldLocked() == false);

  if (this.isWorldLocked() == true) {
    return;
  }

  _ASSERT && common.assert(fixture.m_body == this);

  // Remove the fixture from this body's singly linked list.
  var found = false;
  if (this.m_fixtureList === fixture) {
    this.m_fixtureList = fixture.m_next;
    found = true;

  } else {
    var node = this.m_fixtureList;
    while (node != null) {
      if (node.m_next === fixture) {
        node.m_next = fixture.m_next;
        found = true;
        break;
      }
      node = node.m_next;
    }
  }

  // You tried to remove a shape that is not attached to this body.
  _ASSERT && common.assert(found);

  // Destroy any contacts associated with the fixture.
  var edge = this.m_contactList;
  while (edge) {
    var c = edge.contact;
    edge = edge.next;

    var fixtureA = c.getFixtureA();
    var fixtureB = c.getFixtureB();

    if (fixture == fixtureA || fixture == fixtureB) {
      // This destroys the contact and removes it from
      // this body's contact list.
      this.m_world.destroyContact(c);
    }
  }

  if (this.m_activeFlag) {
    var broadPhase = this.m_world.m_broadPhase;
    fixture.destroyProxies(broadPhase);
  }

  fixture.m_body = null;
  fixture.m_next = null;

  this.m_world.publish('remove-fixture', fixture);

  // Reset the mass data.
  this.resetMassData();
};

/**
 * Get the corresponding world point of a local point.
 */
Body.prototype.getWorldPoint = function(localPoint) {
  return Transform.mulVec2(this.m_xf, localPoint);
};

/**
 * Get the corresponding world vector of a local vector.
 */
Body.prototype.getWorldVector = function(localVector) {
  return Rot.mulVec2(this.m_xf.q, localVector);
};

/**
 * Gets the corresponding local point of a world point.
 */
Body.prototype.getLocalPoint = function(worldPoint) {
  return Transform.mulTVec2(this.m_xf, worldPoint);
};

/**
 * 
 * Gets the corresponding local vector of a world vector.
 */
Body.prototype.getLocalVector = function(worldVector) {
  return Rot.mulTVec2(this.m_xf.q, worldVector);
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/Contact.js":
/*!***************************************************!*\
  !*** ../../node_modules/planck-js/lib/Contact.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var DEBUG_SOLVER = false;

var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");

var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Transform = __webpack_require__(/*! ./common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Mat22 = __webpack_require__(/*! ./common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Rot = __webpack_require__(/*! ./common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");

var Settings = __webpack_require__(/*! ./Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Manifold = __webpack_require__(/*! ./Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var Distance = __webpack_require__(/*! ./collision/Distance */ "../../node_modules/planck-js/lib/collision/Distance.js");

module.exports = Contact;

/**
 * A contact edge is used to connect bodies and contacts together in a contact
 * graph where each body is a node and each contact is an edge. A contact edge
 * belongs to a doubly linked list maintained in each attached body. Each
 * contact has two contact nodes, one for each attached body.
 * 
 * @prop {Contact} contact The contact
 * @prop {ContactEdge} prev The previous contact edge in the body's contact list
 * @prop {ContactEdge} next The next contact edge in the body's contact list
 * @prop {Body} other Provides quick access to the other body attached.
 */
function ContactEdge(contact) {
  this.contact = contact;
  this.prev;
  this.next;
  this.other;
};

/**
 * @function Contact~evaluate
 * 
 * @param manifold
 * @param xfA
 * @param fixtureA
 * @param indexA
 * @param xfB
 * @param fixtureB
 * @param indexB
 */

/**
 * The class manages contact between two shapes. A contact exists for each
 * overlapping AABB in the broad-phase (except if filtered). Therefore a contact
 * object may exist that has no contact points.
 * 
 * @param {Fixture} fA
 * @param {int} indexA
 * @param {Fixture} fB
 * @param {int} indexB
 * @param {Contact~evaluate} evaluateFcn
 */
function Contact(fA, indexA, fB, indexB, evaluateFcn) {
  // Nodes for connecting bodies.
  this.m_nodeA = new ContactEdge(this);
  this.m_nodeB = new ContactEdge(this);

  this.m_fixtureA = fA;
  this.m_fixtureB = fB;

  this.m_indexA = indexA;
  this.m_indexB = indexB;

  this.m_evaluateFcn = evaluateFcn;

  this.m_manifold = new Manifold();

  this.m_prev = null;
  this.m_next = null;

  this.m_toi = 1.0;
  this.m_toiCount = 0;
  // This contact has a valid TOI in m_toi
  this.m_toiFlag = false;

  this.m_friction = mixFriction(this.m_fixtureA.m_friction,
      this.m_fixtureB.m_friction);
  this.m_restitution = mixRestitution(this.m_fixtureA.m_restitution,
      this.m_fixtureB.m_restitution);

  this.m_tangentSpeed = 0.0;

  // This contact can be disabled (by user)
  this.m_enabledFlag = true;

  // Used when crawling contact graph when forming islands.
  this.m_islandFlag = false;

  // Set when the shapes are touching.
  this.m_touchingFlag = false;

  // This contact needs filtering because a fixture filter was changed.
  this.m_filterFlag = false;

  // This bullet contact had a TOI event
  this.m_bulletHitFlag = false;

  this.v_points = []; // VelocityConstraintPoint[maxManifoldPoints]
  this.v_normal = Vec2.zero();
  this.v_normalMass = new Mat22();
  this.v_K = new Mat22();
  this.v_pointCount;

  this.v_tangentSpeed;
  this.v_friction;
  this.v_restitution;

  this.v_invMassA;
  this.v_invMassB;
  this.v_invIA;
  this.v_invIB;

  this.p_localPoints = [] // Vec2[maxManifoldPoints];
  this.p_localNormal = Vec2.zero();
  this.p_localPoint = Vec2.zero();
  this.p_localCenterA = Vec2.zero();
  this.p_localCenterB = Vec2.zero();
  this.p_type; // Manifold.Type
  this.p_radiusA;
  this.p_radiusB;
  this.p_pointCount;

  this.p_invMassA;
  this.p_invMassB;
  this.p_invIA;
  this.p_invIB;
}

Contact.prototype.initConstraint = function(step) {
  var fixtureA = this.m_fixtureA;
  var fixtureB = this.m_fixtureB;

  var shapeA = fixtureA.getShape();
  var shapeB = fixtureB.getShape();

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  var manifold = this.getManifold();

  var pointCount = manifold.pointCount;
  _ASSERT && common.assert(pointCount > 0);

  this.v_invMassA = bodyA.m_invMass;
  this.v_invMassB = bodyB.m_invMass;
  this.v_invIA = bodyA.m_invI;
  this.v_invIB = bodyB.m_invI;

  this.v_friction = this.m_friction;
  this.v_restitution = this.m_restitution;
  this.v_tangentSpeed = this.m_tangentSpeed;

  this.v_pointCount = pointCount;

  this.v_K.setZero();
  this.v_normalMass.setZero();

  this.p_invMassA = bodyA.m_invMass;
  this.p_invMassB = bodyB.m_invMass;
  this.p_invIA = bodyA.m_invI;
  this.p_invIB = bodyB.m_invI;
  this.p_localCenterA = Vec2.clone(bodyA.m_sweep.localCenter);
  this.p_localCenterB = Vec2.clone(bodyB.m_sweep.localCenter);

  this.p_radiusA = shapeA.m_radius;
  this.p_radiusB = shapeB.m_radius;

  this.p_type = manifold.type;
  this.p_localNormal = Vec2.clone(manifold.localNormal);
  this.p_localPoint = Vec2.clone(manifold.localPoint);
  this.p_pointCount = pointCount;

  for (var j = 0; j < pointCount; ++j) {
    var cp = manifold.points[j]; // ManifoldPoint
    var vcp = this.v_points[j] = new VelocityConstraintPoint();

    if (step.warmStarting) {
      vcp.normalImpulse = step.dtRatio * cp.normalImpulse;
      vcp.tangentImpulse = step.dtRatio * cp.tangentImpulse;

    } else {
      vcp.normalImpulse = 0.0;
      vcp.tangentImpulse = 0.0;
    }

    vcp.rA.setZero();
    vcp.rB.setZero();
    vcp.normalMass = 0.0;
    vcp.tangentMass = 0.0;
    vcp.velocityBias = 0.0;

    this.p_localPoints[j] = Vec2.clone(cp.localPoint);

  }
};

/**
 * Get the contact manifold. Do not modify the manifold unless you understand
 * the internals of the library.
 */
Contact.prototype.getManifold = function() {
  return this.m_manifold;
}

/**
 * Get the world manifold.
 * 
 * @param {WorldManifold} [worldManifold]
 */
Contact.prototype.getWorldManifold = function(worldManifold) {
  var bodyA = this.m_fixtureA.getBody();
  var bodyB = this.m_fixtureB.getBody();
  var shapeA = this.m_fixtureA.getShape();
  var shapeB = this.m_fixtureB.getShape();

  return this.m_manifold.getWorldManifold(worldManifold, bodyA.getTransform(),
      shapeA.m_radius, bodyB.getTransform(), shapeB.m_radius);
}

/**
 * Enable/disable this contact. This can be used inside the pre-solve contact
 * listener. The contact is only disabled for the current time step (or sub-step
 * in continuous collisions).
 */
Contact.prototype.setEnabled = function(flag) {
  this.m_enabledFlag = !!flag;
}

/**
 * Has this contact been disabled?
 */
Contact.prototype.isEnabled = function() {
  return this.m_enabledFlag;
}

/**
 * Is this contact touching?
 */
Contact.prototype.isTouching = function() {
  return this.m_touchingFlag;
}

/**
 * Get the next contact in the world's contact list.
 */
Contact.prototype.getNext = function() {
  return this.m_next;
}

/**
 * Get fixture A in this contact.
 */
Contact.prototype.getFixtureA = function() {
  return this.m_fixtureA;
}

/**
 * Get fixture B in this contact.
 */
Contact.prototype.getFixtureB = function() {
  return this.m_fixtureB;
}

/**
 * Get the child primitive index for fixture A.
 */
Contact.prototype.getChildIndexA = function() {
  return this.m_indexA;
}

/**
 * Get the child primitive index for fixture B.
 */
Contact.prototype.getChildIndexB = function() {
  return this.m_indexB;
}

/**
 * Flag this contact for filtering. Filtering will occur the next time step.
 */
Contact.prototype.flagForFiltering = function() {
  this.m_filterFlag = true;
}

/**
 * Override the default friction mixture. You can call this in
 * ContactListener.preSolve. This value persists until set or reset.
 */
Contact.prototype.setFriction = function(friction) {
  this.m_friction = friction;
}

/**
 * Get the friction.
 */
Contact.prototype.getFriction = function() {
  return this.m_friction;
}

/**
 * Reset the friction mixture to the default value.
 */
Contact.prototype.resetFriction = function() {
  this.m_friction = mixFriction(this.m_fixtureA.m_friction,
      this.m_fixtureB.m_friction);
}

/**
 * Override the default restitution mixture. You can call this in
 * ContactListener.preSolve. The value persists until you set or reset.
 */
Contact.prototype.setRestitution = function(restitution) {
  this.m_restitution = restitution;
}

/**
 * Get the restitution.
 */
Contact.prototype.getRestitution = function() {
  return this.m_restitution;
}

/**
 * Reset the restitution to the default value.
 */
Contact.prototype.resetRestitution = function() {
  this.m_restitution = mixRestitution(this.m_fixtureA.m_restitution,
      this.m_fixtureB.m_restitution);
}

/**
 * Set the desired tangent speed for a conveyor belt behavior. In meters per
 * second.
 */
Contact.prototype.setTangentSpeed = function(speed) {
  this.m_tangentSpeed = speed;
}

/**
 * Get the desired tangent speed. In meters per second.
 */
Contact.prototype.getTangentSpeed = function() {
  return this.m_tangentSpeed;
}

/**
 * Called by Update method, and implemented by subclasses.
 */
Contact.prototype.evaluate = function(manifold, xfA, xfB) {
  this.m_evaluateFcn(manifold, xfA, this.m_fixtureA, this.m_indexA, xfB,
      this.m_fixtureB, this.m_indexB);
};

/**
 * Updates the contact manifold and touching status.
 * 
 * Note: do not assume the fixture AABBs are overlapping or are valid.
 * 
 * @param {function} listener.beginContact
 * @param {function} listener.endContact
 * @param {function} listener.preSolve
 */
Contact.prototype.update = function(listener) {

  // Re-enable this contact.
  this.m_enabledFlag = true;

  var touching = false;
  var wasTouching = this.m_touchingFlag;

  var sensorA = this.m_fixtureA.isSensor();
  var sensorB = this.m_fixtureB.isSensor();
  var sensor = sensorA || sensorB;

  var bodyA = this.m_fixtureA.getBody();
  var bodyB = this.m_fixtureB.getBody();
  var xfA = bodyA.getTransform();
  var xfB = bodyB.getTransform();

  // Is this contact a sensor?
  if (sensor) {
    var shapeA = this.m_fixtureA.getShape();
    var shapeB = this.m_fixtureB.getShape();
    touching = Distance.testOverlap(shapeA, this.m_indexA, shapeB,
        this.m_indexB, xfA, xfB);

    // Sensors don't generate manifolds.
    this.m_manifold.pointCount = 0;
  } else {

    // TODO reuse manifold
    var oldManifold = this.m_manifold;
    this.m_manifold = new Manifold();

    this.evaluate(this.m_manifold, xfA, xfB);
    touching = this.m_manifold.pointCount > 0;

    // Match old contact ids to new contact ids and copy the
    // stored impulses to warm start the solver.
    for (var i = 0; i < this.m_manifold.pointCount; ++i) {
      var nmp = this.m_manifold.points[i];
      nmp.normalImpulse = 0.0;
      nmp.tangentImpulse = 0.0;

      for (var j = 0; j < oldManifold.pointCount; ++j) {
        var omp = oldManifold.points[j];
        if (omp.id.key == nmp.id.key) { // ContactID.key
          nmp.normalImpulse = omp.normalImpulse;
          nmp.tangentImpulse = omp.tangentImpulse;
          break;
        }
      }
    }

    if (touching != wasTouching) {
      bodyA.setAwake(true);
      bodyB.setAwake(true);
    }
  }

  this.m_touchingFlag = touching;

  if (wasTouching == false && touching == true && listener) {
    listener.beginContact(this);
  }

  if (wasTouching == true && touching == false && listener) {
    listener.endContact(this);
  }

  if (sensor == false && touching && listener) {
    listener.preSolve(this, oldManifold);
  }
}

Contact.prototype.solvePositionConstraint = function(step) {
  return this._solvePositionConstraint(step, false);
}

Contact.prototype.solvePositionConstraintTOI = function(step, toiA, toiB) {
  return this._solvePositionConstraint(step, true, toiA, toiB);
}

Contact.prototype._solvePositionConstraint = function(step, toi, toiA, toiB) {

  var fixtureA = this.m_fixtureA;
  var fixtureB = this.m_fixtureB;

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  var velocityA = bodyA.c_velocity;
  var velocityB = bodyB.c_velocity;
  var positionA = bodyA.c_position;
  var positionB = bodyB.c_position;

  var localCenterA = Vec2.clone(this.p_localCenterA);
  var localCenterB = Vec2.clone(this.p_localCenterB);

  var mA = 0.0;
  var iA = 0.0;
  if (!toi || (bodyA == toiA || bodyA == toiB)) {
    mA = this.p_invMassA;
    iA = this.p_invIA;
  }

  var mB = 0.0;
  var iB = 0.0;
  if (!toi || (bodyB == toiA || bodyB == toiB)) {
    mB = this.p_invMassB;
    iB = this.p_invIB;
  }

  var cA = Vec2.clone(positionA.c);
  var aA = positionA.a;

  var cB = Vec2.clone(positionB.c);
  var aB = positionB.a;

  var minSeparation = 0.0;

  // Solve normal constraints
  for (var j = 0; j < this.p_pointCount; ++j) {
    var xfA = Transform.identity();
    var xfB = Transform.identity();
    xfA.q.set(aA);
    xfB.q.set(aB);
    xfA.p = Vec2.sub(cA, Rot.mulVec2(xfA.q, localCenterA));
    xfB.p = Vec2.sub(cB, Rot.mulVec2(xfB.q, localCenterB));

    // PositionSolverManifold
    var normal, point, separation;
    switch (this.p_type) {
    case Manifold.e_circles:
      var pointA = Transform.mulVec2(xfA, this.p_localPoint);
      var pointB = Transform.mulVec2(xfB, this.p_localPoints[0]);
      normal = Vec2.sub(pointB, pointA);
      normal.normalize();
      point = Vec2.combine(0.5, pointA, 0.5, pointB);
      separation = Vec2.dot(Vec2.sub(pointB, pointA), normal) - this.p_radiusA
          - this.p_radiusB;
      break;

    case Manifold.e_faceA:
      normal = Rot.mulVec2(xfA.q, this.p_localNormal);
      var planePoint = Transform.mulVec2(xfA, this.p_localPoint);
      var clipPoint = Transform.mulVec2(xfB, this.p_localPoints[j]);
      separation = Vec2.dot(Vec2.sub(clipPoint, planePoint), normal)
          - this.p_radiusA - this.p_radiusB;
      point = clipPoint;
      break;

    case Manifold.e_faceB:
      normal = Rot.mulVec2(xfB.q, this.p_localNormal);
      var planePoint = Transform.mulVec2(xfB, this.p_localPoint);
      var clipPoint = Transform.mulVec2(xfA, this.p_localPoints[j]);
      separation = Vec2.dot(Vec2.sub(clipPoint, planePoint), normal)
          - this.p_radiusA - this.p_radiusB;
      point = clipPoint;

      // Ensure normal points from A to B
      normal.mul(-1);
      break;
    }

    var rA = Vec2.sub(point, cA);
    var rB = Vec2.sub(point, cB);

    // Track max constraint error.
    minSeparation = Math.min(minSeparation, separation);

    var baumgarte = toi ? Settings.toiBaugarte : Settings.baumgarte;
    var linearSlop = Settings.linearSlop;
    var maxLinearCorrection = Settings.maxLinearCorrection;

    // Prevent large corrections and allow slop.
    var C = Math.clamp(baumgarte * (separation + linearSlop),
        -maxLinearCorrection, 0.0);

    // Compute the effective mass.
    var rnA = Vec2.cross(rA, normal);
    var rnB = Vec2.cross(rB, normal);
    var K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;

    // Compute normal impulse
    var impulse = K > 0.0 ? -C / K : 0.0;

    var P = Vec2.mul(impulse, normal);

    cA.subMul(mA, P);
    aA -= iA * Vec2.cross(rA, P);

    cB.addMul(mB, P);
    aB += iB * Vec2.cross(rB, P);
  }

  positionA.c.set(cA);
  positionA.a = aA;

  positionB.c.set(cB);
  positionB.a = aB;

  return minSeparation;
}

// TODO merge with ManifoldPoint
function VelocityConstraintPoint() {
  this.rA = Vec2.zero();
  this.rB = Vec2.zero();
  this.normalImpulse = 0;
  this.tangentImpulse = 0;
  this.normalMass = 0;
  this.tangentMass = 0;
  this.velocityBias = 0;
}

Contact.prototype.initVelocityConstraint = function(step) {
  var fixtureA = this.m_fixtureA;
  var fixtureB = this.m_fixtureB;

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  var velocityA = bodyA.c_velocity;
  var velocityB = bodyB.c_velocity;

  var positionA = bodyA.c_position;
  var positionB = bodyB.c_position;

  var radiusA = this.p_radiusA;
  var radiusB = this.p_radiusB;
  var manifold = this.getManifold();

  var mA = this.v_invMassA;
  var mB = this.v_invMassB;
  var iA = this.v_invIA;
  var iB = this.v_invIB;
  var localCenterA = Vec2.clone(this.p_localCenterA);
  var localCenterB = Vec2.clone(this.p_localCenterB);

  var cA = Vec2.clone(positionA.c);
  var aA = positionA.a;
  var vA = Vec2.clone(velocityA.v);
  var wA = velocityA.w;

  var cB = Vec2.clone(positionB.c);
  var aB = positionB.a;
  var vB = Vec2.clone(velocityB.v);
  var wB = velocityB.w;

  _ASSERT && common.assert(manifold.pointCount > 0);

  var xfA = Transform.identity();
  var xfB = Transform.identity();
  xfA.q.set(aA);
  xfB.q.set(aB);
  xfA.p.setCombine(1, cA, -1, Rot.mulVec2(xfA.q, localCenterA));
  xfB.p.setCombine(1, cB, -1, Rot.mulVec2(xfB.q, localCenterB));

  var worldManifold = manifold.getWorldManifold(null, xfA, radiusA, xfB, radiusB);

  this.v_normal.set(worldManifold.normal);

  for (var j = 0; j < this.v_pointCount; ++j) {
    var vcp = this.v_points[j]; // VelocityConstraintPoint

    vcp.rA.set(Vec2.sub(worldManifold.points[j], cA));
    vcp.rB.set(Vec2.sub(worldManifold.points[j], cB));

    var rnA = Vec2.cross(vcp.rA, this.v_normal);
    var rnB = Vec2.cross(vcp.rB, this.v_normal);

    var kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;

    vcp.normalMass = kNormal > 0.0 ? 1.0 / kNormal : 0.0;

    var tangent = Vec2.cross(this.v_normal, 1.0);

    var rtA = Vec2.cross(vcp.rA, tangent);
    var rtB = Vec2.cross(vcp.rB, tangent);

    var kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;

    vcp.tangentMass = kTangent > 0.0 ? 1.0 / kTangent : 0.0;

    // Setup a velocity bias for restitution.
    vcp.velocityBias = 0.0;
    var vRel = Vec2.dot(this.v_normal, vB)
        + Vec2.dot(this.v_normal, Vec2.cross(wB, vcp.rB))
        - Vec2.dot(this.v_normal, vA)
        - Vec2.dot(this.v_normal, Vec2.cross(wA, vcp.rA));
    if (vRel < -Settings.velocityThreshold) {
      vcp.velocityBias = -this.v_restitution * vRel;
    }
  }

  // If we have two points, then prepare the block solver.
  if (this.v_pointCount == 2 && step.blockSolve) {
    var vcp1 = this.v_points[0]; // VelocityConstraintPoint
    var vcp2 = this.v_points[1]; // VelocityConstraintPoint

    var rn1A = Vec2.cross(vcp1.rA, this.v_normal);
    var rn1B = Vec2.cross(vcp1.rB, this.v_normal);
    var rn2A = Vec2.cross(vcp2.rA, this.v_normal);
    var rn2B = Vec2.cross(vcp2.rB, this.v_normal);

    var k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
    var k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
    var k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;

    // Ensure a reasonable condition number.
    var k_maxConditionNumber = 1000.0;
    if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
      // K is safe to invert.
      this.v_K.ex.set(k11, k12);
      this.v_K.ey.set(k12, k22);
      this.v_normalMass.set(this.v_K.getInverse());
    } else {
      // The constraints are redundant, just use one.
      // TODO_ERIN use deepest?
      this.v_pointCount = 1;
    }
  }

  positionA.c.set(cA);
  positionA.a = aA;
  velocityA.v.set(vA);
  velocityA.w = wA;

  positionB.c.set(cB);
  positionB.a = aB;
  velocityB.v.set(vB);
  velocityB.w = wB;
};

Contact.prototype.warmStartConstraint = function(step) {
  var fixtureA = this.m_fixtureA;
  var fixtureB = this.m_fixtureB;

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  var velocityA = bodyA.c_velocity;
  var velocityB = bodyB.c_velocity;
  var positionA = bodyA.c_position;
  var positionB = bodyB.c_position;

  var mA = this.v_invMassA;
  var iA = this.v_invIA;
  var mB = this.v_invMassB;
  var iB = this.v_invIB;

  var vA = Vec2.clone(velocityA.v);
  var wA = velocityA.w;
  var vB = Vec2.clone(velocityB.v);
  var wB = velocityB.w;

  var normal = this.v_normal;
  var tangent = Vec2.cross(normal, 1.0);

  for (var j = 0; j < this.v_pointCount; ++j) {
    var vcp = this.v_points[j]; // VelocityConstraintPoint

    var P = Vec2.combine(vcp.normalImpulse, normal, vcp.tangentImpulse, tangent);
    wA -= iA * Vec2.cross(vcp.rA, P);
    vA.subMul(mA, P);
    wB += iB * Vec2.cross(vcp.rB, P);
    vB.addMul(mB, P);
  }

  velocityA.v.set(vA);
  velocityA.w = wA;
  velocityB.v.set(vB);
  velocityB.w = wB;
};

Contact.prototype.storeConstraintImpulses = function(step) {
  var manifold = this.m_manifold;
  for (var j = 0; j < this.v_pointCount; ++j) {
    manifold.points[j].normalImpulse = this.v_points[j].normalImpulse;
    manifold.points[j].tangentImpulse = this.v_points[j].tangentImpulse;
  }
};

Contact.prototype.solveVelocityConstraint = function(step) {
  var bodyA = this.m_fixtureA.m_body;
  var bodyB = this.m_fixtureB.m_body;

  var velocityA = bodyA.c_velocity;
  var positionA = bodyA.c_position;

  var velocityB = bodyB.c_velocity;
  var positionB = bodyB.c_position;

  var mA = this.v_invMassA;
  var iA = this.v_invIA;
  var mB = this.v_invMassB;
  var iB = this.v_invIB;

  var vA = Vec2.clone(velocityA.v);
  var wA = velocityA.w;
  var vB = Vec2.clone(velocityB.v);
  var wB = velocityB.w;

  var normal = this.v_normal;
  var tangent = Vec2.cross(normal, 1.0);
  var friction = this.v_friction;

  _ASSERT && common.assert(this.v_pointCount == 1 || this.v_pointCount == 2);

  // Solve tangent constraints first because non-penetration is more important
  // than friction.
  for (var j = 0; j < this.v_pointCount; ++j) {
    var vcp = this.v_points[j]; // VelocityConstraintPoint

    // Relative velocity at contact
    var dv = Vec2.zero();
    dv.addCombine(1, vB, 1, Vec2.cross(wB, vcp.rB));
    dv.subCombine(1, vA, 1, Vec2.cross(wA, vcp.rA));

    // Compute tangent force
    var vt = Vec2.dot(dv, tangent) - this.v_tangentSpeed;
    var lambda = vcp.tangentMass * (-vt);

    // Clamp the accumulated force
    var maxFriction = friction * vcp.normalImpulse;
    var newImpulse = Math.clamp(vcp.tangentImpulse + lambda, -maxFriction,
        maxFriction);
    lambda = newImpulse - vcp.tangentImpulse;
    vcp.tangentImpulse = newImpulse;

    // Apply contact impulse
    var P = Vec2.mul(lambda, tangent);

    vA.subMul(mA, P);
    wA -= iA * Vec2.cross(vcp.rA, P);

    vB.addMul(mB, P);
    wB += iB * Vec2.cross(vcp.rB, P);
  }

  // Solve normal constraints
  if (this.v_pointCount == 1 || step.blockSolve == false) {
    for (var i = 0; i < this.v_pointCount; ++i) {
      var vcp = this.v_points[i]; // VelocityConstraintPoint

      // Relative velocity at contact
      var dv = Vec2.zero();
      dv.addCombine(1, vB, 1, Vec2.cross(wB, vcp.rB));
      dv.subCombine(1, vA, 1, Vec2.cross(wA, vcp.rA));

      // Compute normal impulse
      var vn = Vec2.dot(dv, normal);
      var lambda = -vcp.normalMass * (vn - vcp.velocityBias);

      // Clamp the accumulated impulse
      var newImpulse = Math.max(vcp.normalImpulse + lambda, 0.0);
      lambda = newImpulse - vcp.normalImpulse;
      vcp.normalImpulse = newImpulse;

      // Apply contact impulse
      var P = Vec2.mul(lambda, normal);

      vA.subMul(mA, P);
      wA -= iA * Vec2.cross(vcp.rA, P);

      vB.addMul(mB, P);
      wB += iB * Vec2.cross(vcp.rB, P);
    }
  } else {
    // Block solver developed in collaboration with Dirk Gregorius (back in
    // 01/07 on Box2D_Lite).
    // Build the mini LCP for this contact patch
    //
    // vn = A * x + b, vn >= 0, , vn >= 0, x >= 0 and vn_i * x_i = 0 with i =
    // 1..2
    //
    // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
    // b = vn0 - velocityBias
    //
    // The system is solved using the "Total enumeration method" (s. Murty).
    // The complementary constraint vn_i * x_i
    // implies that we must have in any solution either vn_i = 0 or x_i = 0.
    // So for the 2D contact problem the cases
    // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and
    // vn1 = 0 need to be tested. The first valid
    // solution that satisfies the problem is chosen.
    // 
    // In order to account of the accumulated impulse 'a' (because of the
    // iterative nature of the solver which only requires
    // that the accumulated impulse is clamped and not the incremental
    // impulse) we change the impulse variable (x_i).
    //
    // Substitute:
    // 
    // x = a + d
    // 
    // a := old total impulse
    // x := new total impulse
    // d := incremental impulse
    //
    // For the current iteration we extend the formula for the incremental
    // impulse
    // to compute the new total impulse:
    //
    // vn = A * d + b
    // = A * (x - a) + b
    // = A * x + b - A * a
    // = A * x + b'
    // b' = b - A * a;

    var vcp1 = this.v_points[0]; // VelocityConstraintPoint
    var vcp2 = this.v_points[1]; // VelocityConstraintPoint

    var a = Vec2.neo(vcp1.normalImpulse, vcp2.normalImpulse);
    _ASSERT && common.assert(a.x >= 0.0 && a.y >= 0.0);

    // Relative velocity at contact
    var dv1 = Vec2.zero().add(vB).add(Vec2.cross(wB, vcp1.rB)).sub(vA).sub(Vec2.cross(wA, vcp1.rA));
    var dv2 = Vec2.zero().add(vB).add(Vec2.cross(wB, vcp2.rB)).sub(vA).sub(Vec2.cross(wA, vcp2.rA));

    // Compute normal velocity
    var vn1 = Vec2.dot(dv1, normal);
    var vn2 = Vec2.dot(dv2, normal);

    var b = Vec2.neo(vn1 - vcp1.velocityBias, vn2 - vcp2.velocityBias);

    // Compute b'
    b.sub(Mat22.mulVec2(this.v_K, a));

    var k_errorTol = 1e-3;
    // NOT_USED(k_errorTol);

    for (;;) {
      //
      // Case 1: vn = 0
      //
      // 0 = A * x + b'
      //
      // Solve for x:
      //
      // x = - inv(A) * b'
      //
      var x = Mat22.mulVec2(this.v_normalMass, b).neg();

      if (x.x >= 0.0 && x.y >= 0.0) {
        // Get the incremental impulse
        var d = Vec2.sub(x, a);

        // Apply incremental impulse
        var P1 = Vec2.mul(d.x, normal);
        var P2 = Vec2.mul(d.y, normal);

        vA.subCombine(mA, P1, mA, P2);
        wA -= iA * (Vec2.cross(vcp1.rA, P1) + Vec2.cross(vcp2.rA, P2));

        vB.addCombine(mB, P1, mB, P2);
        wB += iB * (Vec2.cross(vcp1.rB, P1) + Vec2.cross(vcp2.rB, P2));

        // Accumulate
        vcp1.normalImpulse = x.x;
        vcp2.normalImpulse = x.y;

        if (DEBUG_SOLVER) {
          // Postconditions
          dv1 = vB + Vec2.cross(wB, vcp1.rB) - vA - Vec2.cross(wA, vcp1.rA);
          dv2 = vB + Vec2.cross(wB, vcp2.rB) - vA - Vec2.cross(wA, vcp2.rA);

          // Compute normal velocity
          vn1 = Dot(dv1, normal);
          vn2 = Dot(dv2, normal);

          _ASSERT && common.assert(Abs(vn1 - vcp1.velocityBias) < k_errorTol);
          _ASSERT && common.assert(Abs(vn2 - vcp2.velocityBias) < k_errorTol);
        }
        break;
      }

      //
      // Case 2: vn1 = 0 and x2 = 0
      //
      // 0 = a11 * x1 + a12 * 0 + b1'
      // vn2 = a21 * x1 + a22 * 0 + b2'
      //
      x.x = -vcp1.normalMass * b.x;
      x.y = 0.0;
      vn1 = 0.0;
      vn2 = this.v_K.ex.y * x.x + b.y;

      if (x.x >= 0.0 && vn2 >= 0.0) {
        // Get the incremental impulse
        var d = Vec2.sub(x, a);

        // Apply incremental impulse
        var P1 = Vec2.mul(d.x, normal);
        var P2 = Vec2.mul(d.y, normal);
        vA.subCombine(mA, P1, mA, P2);
        wA -= iA * (Vec2.cross(vcp1.rA, P1) + Vec2.cross(vcp2.rA, P2));

        vB.addCombine(mB, P1, mB, P2);
        wB += iB * (Vec2.cross(vcp1.rB, P1) + Vec2.cross(vcp2.rB, P2));

        // Accumulate
        vcp1.normalImpulse = x.x;
        vcp2.normalImpulse = x.y;

        if (DEBUG_SOLVER) {
          // Postconditions
          var dv1B = Vec2.add(vB, Vec2.cross(wB, vcp1.rB));
          var dv1A = Vec2.add(vA, Vec2.cross(wA, vcp1.rA));
          var dv1 = Vec2.sub(dv1B, dv1A);

          // Compute normal velocity
          vn1 = Vec2.dot(dv1, normal);

          _ASSERT && common.assert(Math.abs(vn1 - vcp1.velocityBias) < k_errorTol);
        }
        break;
      }

      //
      // Case 3: vn2 = 0 and x1 = 0
      //
      // vn1 = a11 * 0 + a12 * x2 + b1'
      // 0 = a21 * 0 + a22 * x2 + b2'
      //
      x.x = 0.0;
      x.y = -vcp2.normalMass * b.y;
      vn1 = this.v_K.ey.x * x.y + b.x;
      vn2 = 0.0;

      if (x.y >= 0.0 && vn1 >= 0.0) {
        // Resubstitute for the incremental impulse
        var d = Vec2.sub(x, a);

        // Apply incremental impulse
        var P1 = Vec2.mul(d.x, normal);
        var P2 = Vec2.mul(d.y, normal);
        vA.subCombine(mA, P1, mA, P2);
        wA -= iA * (Vec2.cross(vcp1.rA, P1) + Vec2.cross(vcp2.rA, P2));

        vB.addCombine(mB, P1, mB, P2);
        wB += iB * (Vec2.cross(vcp1.rB, P1) + Vec2.cross(vcp2.rB, P2));

        // Accumulate
        vcp1.normalImpulse = x.x;
        vcp2.normalImpulse = x.y;

        if (DEBUG_SOLVER) {
          // Postconditions
          var dv2B = Vec2.add(vB, Vec2.cross(wB, vcp2.rB));
          var dv2A = Vec2.add(vA, Vec2.cross(wA, vcp2.rA));
          var dv1 = Vec2.sub(dv2B, dv2A);

          // Compute normal velocity
          vn2 = Vec2.dot(dv2, normal);

          _ASSERT && common.assert(Math.abs(vn2 - vcp2.velocityBias) < k_errorTol);
        }
        break;
      }

      //
      // Case 4: x1 = 0 and x2 = 0
      // 
      // vn1 = b1
      // vn2 = b2;
      //
      x.x = 0.0;
      x.y = 0.0;
      vn1 = b.x;
      vn2 = b.y;

      if (vn1 >= 0.0 && vn2 >= 0.0) {
        // Resubstitute for the incremental impulse
        var d = Vec2.sub(x, a);

        // Apply incremental impulse
        var P1 = Vec2.mul(d.x, normal);
        var P2 = Vec2.mul(d.y, normal);
        vA.subCombine(mA, P1, mA, P2);
        wA -= iA * (Vec2.cross(vcp1.rA, P1) + Vec2.cross(vcp2.rA, P2));

        vB.addCombine(mB, P1, mB, P2);
        wB += iB * (Vec2.cross(vcp1.rB, P1) + Vec2.cross(vcp2.rB, P2));

        // Accumulate
        vcp1.normalImpulse = x.x;
        vcp2.normalImpulse = x.y;

        break;
      }

      // No solution, give up. This is hit sometimes, but it doesn't seem to
      // matter.
      break;
    }
  }

  velocityA.v.set(vA);
  velocityA.w = wA;

  velocityB.v.set(vB);
  velocityB.w = wB;
};

/**
 * Friction mixing law. The idea is to allow either fixture to drive the
 * restitution to zero. For example, anything slides on ice.
 */
function mixFriction(friction1, friction2) {
  return Math.sqrt(friction1 * friction2);
}

/**
 * Restitution mixing law. The idea is allow for anything to bounce off an
 * inelastic surface. For example, a superball bounces on anything.
 */
function mixRestitution(restitution1, restitution2) {
  return restitution1 > restitution2 ? restitution1 : restitution2;
}

var s_registers = [];

/**
 * @param fn function(fixtureA, indexA, fixtureB, indexB) Contact
 */
Contact.addType = function(type1, type2, callback) {

  s_registers[type1] = s_registers[type1] || {};
  s_registers[type1][type2] = callback;
}

Contact.create = function(fixtureA, indexA, fixtureB, indexB) {
  var typeA = fixtureA.getType(); // Shape.Type
  var typeB = fixtureB.getType(); // Shape.Type

  // TODO: pool contacts
  var contact, evaluateFcn;
  if (evaluateFcn = s_registers[typeA] && s_registers[typeA][typeB]) {
    contact = new Contact(fixtureA, indexA, fixtureB, indexB, evaluateFcn);
  } else if (evaluateFcn = s_registers[typeB] && s_registers[typeB][typeA]) {
    contact = new Contact(fixtureB, indexB, fixtureA, indexA, evaluateFcn);
  } else {
    return null;
  }

  // Contact creation may swap fixtures.
  fixtureA = contact.getFixtureA();
  fixtureB = contact.getFixtureB();
  indexA = contact.getChildIndexA();
  indexB = contact.getChildIndexB();
  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  // Connect to body A
  contact.m_nodeA.contact = contact;
  contact.m_nodeA.other = bodyB;

  contact.m_nodeA.prev = null;
  contact.m_nodeA.next = bodyA.m_contactList;
  if (bodyA.m_contactList != null) {
    bodyA.m_contactList.prev = contact.m_nodeA;
  }
  bodyA.m_contactList = contact.m_nodeA;

  // Connect to body B
  contact.m_nodeB.contact = contact;
  contact.m_nodeB.other = bodyA;

  contact.m_nodeB.prev = null;
  contact.m_nodeB.next = bodyB.m_contactList;
  if (bodyB.m_contactList != null) {
    bodyB.m_contactList.prev = contact.m_nodeB;
  }
  bodyB.m_contactList = contact.m_nodeB;

  // Wake up the bodies
  if (fixtureA.isSensor() == false && fixtureB.isSensor() == false) {
    bodyA.setAwake(true);
    bodyB.setAwake(true);
  }

  return contact;
}

Contact.destroy = function(contact, listener) {
  var fixtureA = contact.m_fixtureA;
  var fixtureB = contact.m_fixtureB;

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  if (contact.isTouching()) {
    listener.endContact(contact);
  }

  // Remove from body 1
  if (contact.m_nodeA.prev) {
    contact.m_nodeA.prev.next = contact.m_nodeA.next;
  }

  if (contact.m_nodeA.next) {
    contact.m_nodeA.next.prev = contact.m_nodeA.prev;
  }

  if (contact.m_nodeA == bodyA.m_contactList) {
    bodyA.m_contactList = contact.m_nodeA.next;
  }

  // Remove from body 2
  if (contact.m_nodeB.prev) {
    contact.m_nodeB.prev.next = contact.m_nodeB.next;
  }

  if (contact.m_nodeB.next) {
    contact.m_nodeB.next.prev = contact.m_nodeB.prev;
  }

  if (contact.m_nodeB == bodyB.m_contactList) {
    bodyB.m_contactList = contact.m_nodeB.next;
  }

  if (contact.m_manifold.pointCount > 0 && fixtureA.isSensor() == false
      && fixtureB.isSensor() == false) {
    bodyA.setAwake(true);
    bodyB.setAwake(true);
  }

  var typeA = fixtureA.getType(); // Shape.Type
  var typeB = fixtureB.getType(); // Shape.Type

  var destroyFcn = s_registers[typeA][typeB].destroyFcn;
  if (typeof destroyFcn === 'function') {
    destroyFcn(contact);
  }
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/Fixture.js":
/*!***************************************************!*\
  !*** ../../node_modules/planck-js/lib/Fixture.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Fixture;

var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ./util/options */ "../../node_modules/planck-js/lib/util/options.js");

var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");

var AABB = __webpack_require__(/*! ./collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");

var Shape = __webpack_require__(/*! ./Shape */ "../../node_modules/planck-js/lib/Shape.js");

/**
 * @typedef {Object} FixtureDef
 *
 * A fixture definition is used to create a fixture. This class defines an
 * abstract fixture definition. You can reuse fixture definitions safely.
 * 
 * @prop friction The friction coefficient, usually in the range [0,1]
 * @prop restitution The restitution (elasticity) usually in the range [0,1]
 * @prop density The density, usually in kg/m^2
 * @prop isSensor A sensor shape collects contact information but never
 *       generates a collision response
 * @prop userData
 * @prop filterGroupIndex Zero, positive or negative collision group. Fixtures with same positive groupIndex always collide and fixtures with same
 * negative groupIndex never collide.
 * @prop filterCategoryBits Collision category bit or bits that this fixture belongs
 *       to. If groupIndex is zero or not matching, then at least one bit in this fixture
 * categoryBits should match other fixture maskBits and vice versa.
 * @prop filterMaskBits Collision category bit or bits that this fixture accept for
 *       collision.
 */
var FixtureDef = {
  userData : null,
  friction : 0.2,
  restitution : 0.0,
  density : 0.0,
  isSensor : false,

  filterGroupIndex : 0,
  filterCategoryBits : 0x0001,
  filterMaskBits : 0xFFFF
};

/**
 * This proxy is used internally to connect shape children to the broad-phase.
 */
function FixtureProxy(fixture, childIndex) {
  this.aabb = new AABB();
  this.fixture = fixture;
  this.childIndex = childIndex;
  this.proxyId;
};

/**
 * A fixture is used to attach a shape to a body for collision detection. A
 * fixture inherits its transform from its parent. Fixtures hold additional
 * non-geometric data such as friction, collision filters, etc. Fixtures are
 * created via Body.createFixture.
 * 
 * @param {Body} body
 * @param {Shape|FixtureDef} shape Shape of fixture definition.
 * @param {FixtureDef|number} def Fixture definition or number.
 */
function Fixture(body, shape, def) {
  if (shape.shape) {
    def = shape;
    shape = shape.shape;

  } else if (typeof def === 'number') {
    def = {density : def};
  }

  def = options(def, FixtureDef);

  this.m_body = body;

  this.m_friction = def.friction;
  this.m_restitution = def.restitution;
  this.m_density = def.density;
  this.m_isSensor = def.isSensor;

  this.m_filterGroupIndex = def.filterGroupIndex;
  this.m_filterCategoryBits = def.filterCategoryBits;
  this.m_filterMaskBits = def.filterMaskBits;

  // TODO validate shape
  this.m_shape = shape; //.clone();

  this.m_next = null;

  this.m_proxies = [];
  this.m_proxyCount = 0;

  var childCount = this.m_shape.getChildCount();
  for (var i = 0; i < childCount; ++i) {
    this.m_proxies[i] = new FixtureProxy(this, i);
  }

  this.m_userData = def.userData;
};

/**
 * Re-setup fixture.
 * @private
 */
Fixture.prototype._reset = function() {
  var body = this.getBody();
  var broadPhase = body.m_world.m_broadPhase;
  this.destroyProxies(broadPhase);
  if (this.m_shape._reset) {
    this.m_shape._reset();
  }
  var childCount = this.m_shape.getChildCount();
  for (var i = 0; i < childCount; ++i) {
    this.m_proxies[i] = new FixtureProxy(this, i);
  }
  this.createProxies(broadPhase, body.m_xf);
  body.resetMassData();
};

Fixture.prototype._serialize = function() {
  return {
    friction: this.m_friction,
    restitution: this.m_restitution,
    density: this.m_density,
    isSensor: this.m_isSensor,

    filterGroupIndex: this.m_filterGroupIndex,
    filterCategoryBits: this.m_filterCategoryBits,
    filterMaskBits: this.m_filterMaskBits,

    shape: this.m_shape,
  };
};

Fixture._deserialize = function(data, body, restore) {
  var shape = restore(Shape, data.shape);
  var fixture = shape && new Fixture(body, shape, data);
  return fixture;
};

/**
 * Get the type of the child shape. You can use this to down cast to the
 * concrete shape.
 */
Fixture.prototype.getType = function() {
  return this.m_shape.getType();
}

/**
 * Get the child shape. You can modify the child shape, however you should not
 * change the number of vertices because this will crash some collision caching
 * mechanisms. Manipulating the shape may lead to non-physical behavior.
 */
Fixture.prototype.getShape = function() {
  return this.m_shape;
}
/**
 * A sensor shape collects contact information but never generates a collision
 * response.
 */
Fixture.prototype.isSensor = function() {
  return this.m_isSensor;
}

/**
 * Set if this fixture is a sensor.
 */
Fixture.prototype.setSensor = function(sensor) {
  if (sensor != this.m_isSensor) {
    this.m_body.setAwake(true);
    this.m_isSensor = sensor;
  }
}

/**
 * Get the contact filtering data.
 */
// Fixture.prototype.getFilterData = function() {
//   return this.m_filter;
// }

/**
 * Get the user data that was assigned in the fixture definition. Use this to
 * store your application specific data.
 */
Fixture.prototype.getUserData = function() {
  return this.m_userData;
}

/**
 * Set the user data. Use this to store your application specific data.
 */
Fixture.prototype.setUserData = function(data) {
  this.m_userData = data;
}

/**
 * Get the parent body of this fixture. This is null if the fixture is not
 * attached.
 */
Fixture.prototype.getBody = function() {
  return this.m_body;
}

/**
 * Get the next fixture in the parent body's fixture list.
 */
Fixture.prototype.getNext = function() {
  return this.m_next;
}

/**
 * Get the density of this fixture.
 */
Fixture.prototype.getDensity = function() {
  return this.m_density;
}

/**
 * Set the density of this fixture. This will _not_ automatically adjust the
 * mass of the body. You must call Body.resetMassData to update the body's mass.
 */
Fixture.prototype.setDensity = function(density) {
  _ASSERT && common.assert(Math.isFinite(density) && density >= 0.0);
  this.m_density = density;
}

/**
 * Get the coefficient of friction, usually in the range [0,1].
 */
Fixture.prototype.getFriction = function() {
  return this.m_friction;
}

/**
 * Set the coefficient of friction. This will not change the friction of
 * existing contacts.
 */
Fixture.prototype.setFriction = function(friction) {
  this.m_friction = friction;
}

/**
 * Get the coefficient of restitution.
 */
Fixture.prototype.getRestitution = function() {
  return this.m_restitution;
}

/**
 * Set the coefficient of restitution. This will not change the restitution of
 * existing contacts.
 */
Fixture.prototype.setRestitution = function(restitution) {
  this.m_restitution = restitution;
}

/**
 * Test a point in world coordinates for containment in this fixture.
 */
Fixture.prototype.testPoint = function(p) {
  return this.m_shape.testPoint(this.m_body.getTransform(), p);
}

/**
 * Cast a ray against this shape.
 */
Fixture.prototype.rayCast = function(output, input, childIndex) {
  return this.m_shape.rayCast(output, input, this.m_body.getTransform(), childIndex);
}

/**
 * Get the mass data for this fixture. The mass data is based on the density and
 * the shape. The rotational inertia is about the shape's origin. This operation
 * may be expensive.
 */
Fixture.prototype.getMassData = function(massData) {
  this.m_shape.computeMass(massData, this.m_density);
}

/**
 * Get the fixture's AABB. This AABB may be enlarge and/or stale. If you need a
 * more accurate AABB, compute it using the shape and the body transform.
 */
Fixture.prototype.getAABB = function(childIndex) {
  _ASSERT && common.assert(0 <= childIndex && childIndex < this.m_proxyCount);
  return this.m_proxies[childIndex].aabb;
}

/**
 * These support body activation/deactivation.
 */
Fixture.prototype.createProxies = function(broadPhase, xf) {
  _ASSERT && common.assert(this.m_proxyCount == 0);

  // Create proxies in the broad-phase.
  this.m_proxyCount = this.m_shape.getChildCount();

  for (var i = 0; i < this.m_proxyCount; ++i) {
    var proxy = this.m_proxies[i];
    this.m_shape.computeAABB(proxy.aabb, xf, i);
    proxy.proxyId = broadPhase.createProxy(proxy.aabb, proxy);
  }
}

Fixture.prototype.destroyProxies = function(broadPhase) {
  // Destroy proxies in the broad-phase.
  for (var i = 0; i < this.m_proxyCount; ++i) {
    var proxy = this.m_proxies[i];
    broadPhase.destroyProxy(proxy.proxyId);
    proxy.proxyId = null;
  }

  this.m_proxyCount = 0;
}

/**
 * Updates this fixture proxy in broad-phase (with combined AABB of current and
 * next transformation).
 */
Fixture.prototype.synchronize = function(broadPhase, xf1, xf2) {
  for (var i = 0; i < this.m_proxyCount; ++i) {
    var proxy = this.m_proxies[i];
    // Compute an AABB that covers the swept shape (may miss some rotation
    // effect).
    var aabb1 = new AABB();
    var aabb2 = new AABB();
    this.m_shape.computeAABB(aabb1, xf1, proxy.childIndex);
    this.m_shape.computeAABB(aabb2, xf2, proxy.childIndex);

    proxy.aabb.combine(aabb1, aabb2);

    var displacement = Vec2.sub(xf2.p, xf1.p);

    broadPhase.moveProxy(proxy.proxyId, proxy.aabb, displacement);
  }
}

/**
 * Set the contact filtering data. This will not update contacts until the next
 * time step when either parent body is active and awake. This automatically
 * calls refilter.
 */
Fixture.prototype.setFilterData = function(filter) {
  this.m_filterGroupIndex = filter.groupIndex;
  this.m_filterCategoryBits = filter.categoryBits;
  this.m_filterMaskBits = filter.maskBits;
  this.refilter();
}

Fixture.prototype.getFilterGroupIndex = function() {
  return this.m_filterGroupIndex;
}

Fixture.prototype.setFilterGroupIndex = function(groupIndex) {
  return this.m_filterGroupIndex = groupIndex;
}

Fixture.prototype.getFilterCategoryBits = function() {
  return this.m_filterCategoryBits;
}

Fixture.prototype.setFilterCategoryBits = function(categoryBits) {
  this.m_filterCategoryBits = categoryBits;
}

Fixture.prototype.getFilterMaskBits = function() {
  return this.m_filterMaskBits;
}

Fixture.prototype.setFilterMaskBits = function(maskBits) {
  this.m_filterMaskBits = maskBits;
}

/**
 * Call this if you want to establish collision that was previously disabled by
 * ContactFilter.
 */
Fixture.prototype.refilter = function() {
  if (this.m_body == null) {
    return;
  }

  // Flag associated contacts for filtering.
  var edge = this.m_body.getContactList();
  while (edge) {
    var contact = edge.contact;
    var fixtureA = contact.getFixtureA();
    var fixtureB = contact.getFixtureB();
    if (fixtureA == this || fixtureB == this) {
      contact.flagForFiltering();
    }

    edge = edge.next;
  }

  var world = this.m_body.getWorld();

  if (world == null) {
    return;
  }

  // Touch each proxy so that new pairs may be created
  var broadPhase = world.m_broadPhase;
  for (var i = 0; i < this.m_proxyCount; ++i) {
    broadPhase.touchProxy(this.m_proxies[i].proxyId);
  }
}

/**
 * Implement this method to provide collision filtering, if you want finer
 * control over contact creation.
 * 
 * Return true if contact calculations should be performed between these two
 * fixtures.
 * 
 * Warning: for performance reasons this is only called when the AABBs begin to
 * overlap.
 * 
 * @param {Fixture} that
 */
Fixture.prototype.shouldCollide = function(that) {

  if (that.m_filterGroupIndex === this.m_filterGroupIndex && that.m_filterGroupIndex !== 0) {
    return that.m_filterGroupIndex > 0;
  }

  var collideA = (that.m_filterMaskBits & this.m_filterCategoryBits) !== 0;
  var collideB = (that.m_filterCategoryBits & this.m_filterMaskBits) !== 0;
  var collide = collideA && collideB;
  return collide;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/Joint.js":
/*!*************************************************!*\
  !*** ../../node_modules/planck-js/lib/Joint.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Joint;

var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");

/**
 * A joint edge is used to connect bodies and joints together in a joint graph
 * where each body is a node and each joint is an edge. A joint edge belongs to
 * a doubly linked list maintained in each attached body. Each joint has two
 * joint nodes, one for each attached body.
 * 
 * @prop {Body} other provides quick access to the other body attached.
 * @prop {Joint} joint the joint
 * @prop {JointEdge} prev the previous joint edge in the body's joint list
 * @prop {JointEdge} next the next joint edge in the body's joint list
 */
function JointEdge() {
  this.other = null;
  this.joint = null;
  this.prev = null;
  this.next = null;
};

/**
 * @typedef {Object} JointDef
 *
 * Joint definitions are used to construct joints.
 * 
 * @prop userData Use this to attach application specific data to your joints.
 *       void userData;
 * @prop {boolean} collideConnected Set this flag to true if the attached bodies
 *       should collide.
 *
 * @prop {Body} bodyA The first attached body.
 * @prop {Body} bodyB The second attached body.
 */

var DEFAULTS = {
  userData : null,
  collideConnected : false
};

/**
 * The base joint class. Joints are used to constraint two bodies together in
 * various fashions. Some joints also feature limits and motors.
 * 
 * @param {JointDef} def
 */
function Joint(def, bodyA, bodyB) {
  bodyA = def.bodyA || bodyA;
  bodyB = def.bodyB || bodyB;

  _ASSERT && common.assert(bodyA);
  _ASSERT && common.assert(bodyB);
  _ASSERT && common.assert(bodyA != bodyB);

  this.m_type = 'unknown-joint';

  this.m_bodyA = bodyA;
  this.m_bodyB = bodyB;

  this.m_index = 0;
  this.m_collideConnected = !!def.collideConnected;

  this.m_prev = null;
  this.m_next = null;

  this.m_edgeA = new JointEdge();
  this.m_edgeB = new JointEdge();

  this.m_islandFlag = false;
  this.m_userData = def.userData;
};

Joint.TYPES = {};

Joint._deserialize = function(data, context, restore) {
  var clazz = Joint.TYPES[data.type];
  return clazz && restore(clazz, data);
};

/**
 * Short-cut function to determine if either body is inactive.
 * 
 * @returns {boolean}
 */
Joint.prototype.isActive = function() {
  return this.m_bodyA.isActive() && this.m_bodyB.isActive();
}

/**
 * Get the type of the concrete joint.
 * 
 * @returns JointType
 */
Joint.prototype.getType = function() {
  return this.m_type;
}

/**
 * Get the first body attached to this joint.
 * 
 * @returns Body
 */
Joint.prototype.getBodyA = function() {
  return this.m_bodyA;
}

/**
 * Get the second body attached to this joint.
 * 
 * @returns Body
 */
Joint.prototype.getBodyB = function() {
  return this.m_bodyB;
}

/**
 * Get the next joint the world joint list.
 * 
 * @returns Joint
 */
Joint.prototype.getNext = function() {
  return this.m_next;
}

Joint.prototype.getUserData = function() {
  return this.m_userData;
}

Joint.prototype.setUserData = function(data) {
  this.m_userData = data;
}

/**
 * Get collide connected. Note: modifying the collide connect flag won't work
 * correctly because the flag is only checked when fixture AABBs begin to
 * overlap.
 * 
 * @returns {boolean}
 */
Joint.prototype.getCollideConnected = function() {
  return this.m_collideConnected;
};

/**
 * Get the anchor point on bodyA in world coordinates.
 * 
 * @return {Vec2}
 */
Joint.prototype.getAnchorA = function() {
};

/**
 * Get the anchor point on bodyB in world coordinates.
 * 
 * @return {Vec2}
 */
Joint.prototype.getAnchorB = function() {
};

/**
 * Get the reaction force on bodyB at the joint anchor in Newtons.
 * 
 * @param {float} inv_dt
 * @return {Vec2}
 */
Joint.prototype.getReactionForce = function(inv_dt) {
};

/**
 * Get the reaction torque on bodyB in N*m.
 * 
 * @param {float} inv_dt
 * @return {float}
 */
Joint.prototype.getReactionTorque = function(inv_dt) {
};

/**
 * Shift the origin for any points stored in world coordinates.
 * 
 * @param {Vec2} newOrigin
 */
Joint.prototype.shiftOrigin = function(newOrigin) {
};

/**
 */
Joint.prototype.initVelocityConstraints = function(step) {
};

/**
 */
Joint.prototype.solveVelocityConstraints = function(step) {
};

/**
 * This returns true if the position errors are within tolerance.
 */
Joint.prototype.solvePositionConstraints = function(step) {
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/Manifold.js":
/*!****************************************************!*\
  !*** ../../node_modules/planck-js/lib/Manifold.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");

var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Transform = __webpack_require__(/*! ./common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Rot = __webpack_require__(/*! ./common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");

module.exports = Manifold;
module.exports.clipSegmentToLine = clipSegmentToLine;
module.exports.clipVertex = ClipVertex;
module.exports.getPointStates = getPointStates;
module.exports.PointState = PointState;

// Manifold Type
Manifold.e_circles = 0;
Manifold.e_faceA = 1;
Manifold.e_faceB = 2;

// ContactFeature Type
Manifold.e_vertex = 0;
Manifold.e_face = 1;

/**
 * A manifold for two touching convex shapes. Manifolds are created in `evaluate`
 * method of Contact subclasses.
 * 
 * Supported manifold types are e_faceA or e_faceB for clip point versus plane
 * with radius and e_circles point versus point with radius.
 * 
 * We store contacts in this way so that position correction can account for
 * movement, which is critical for continuous physics. All contact scenarios
 * must be expressed in one of these types. This structure is stored across time
 * steps, so we keep it small.
 * 
 * @prop type e_circle, e_faceA, e_faceB
 * @prop localPoint Usage depends on manifold type:<br>
 *       e_circles: the local center of circleA <br>
 *       e_faceA: the center of faceA <br>
 *       e_faceB: the center of faceB
 * @prop localNormal Usage depends on manifold type:<br>
 *       e_circles: not used <br>
 *       e_faceA: the normal on polygonA <br>
 *       e_faceB: the normal on polygonB
 * @prop points The points of contact {ManifoldPoint[]}
 * @prop pointCount The number of manifold points
 */
function Manifold() {
  this.type;
  this.localNormal = Vec2.zero();
  this.localPoint = Vec2.zero();
  this.points = [ new ManifoldPoint(), new ManifoldPoint() ];
  this.pointCount = 0;
};

/**
 * A manifold point is a contact point belonging to a contact manifold. It holds
 * details related to the geometry and dynamics of the contact points.
 * 
 * This structure is stored across time steps, so we keep it small.
 * 
 * Note: impulses are used for internal caching and may not provide reliable
 * contact forces, especially for high speed collisions.
 * 
 * @prop {Vec2} localPoint Usage depends on manifold type:<br>
 *       e_circles: the local center of circleB<br>
 *       e_faceA: the local center of cirlceB or the clip point of polygonB<br>
 *       e_faceB: the clip point of polygonA.
 * @prop normalImpulse The non-penetration impulse
 * @prop tangentImpulse The friction impulse
 * @prop {ContactID} id Uniquely identifies a contact point between two shapes
 *       to facilatate warm starting
 */
function ManifoldPoint() {
  this.localPoint = Vec2.zero();
  this.normalImpulse = 0;
  this.tangentImpulse = 0;
  this.id = new ContactID();
};

/**
 * Contact ids to facilitate warm starting.
 * 
 * @prop {ContactFeature} cf
 * @prop key Used to quickly compare contact ids.
 * 
 */
function ContactID() {
  this.cf = new ContactFeature();
};

Object.defineProperty(ContactID.prototype, 'key', {
  get: function() {
    return this.cf.indexA + this.cf.indexB * 4 + this.cf.typeA * 16 + this.cf.typeB * 64;
  },
  enumerable: true,
  configurable: true
});

ContactID.prototype.set = function(o) {
  // this.key = o.key;
  this.cf.set(o.cf);
};

/**
 * The features that intersect to form the contact point.
 * 
 * @prop indexA Feature index on shapeA
 * @prop indexB Feature index on shapeB
 * @prop typeA The feature type on shapeA
 * @prop typeB The feature type on shapeB
 */
function ContactFeature() {
  this.indexA;
  this.indexB;
  this.typeA;
  this.typeB;
};

ContactFeature.prototype.set = function(o) {
  this.indexA = o.indexA;
  this.indexB = o.indexB;
  this.typeA = o.typeA;
  this.typeB = o.typeB;
};

/**
 * This is used to compute the current state of a contact manifold.
 * 
 * @prop normal World vector pointing from A to B
 * @prop points World contact point (point of intersection)
 * @prop separations A negative value indicates overlap, in meters
 */
function WorldManifold() {
  this.normal;
  this.points = []; // [maxManifoldPoints]
  this.separations = []; // float[maxManifoldPoints]
};

/**
 * Evaluate the manifold with supplied transforms. This assumes modest motion
 * from the original state. This does not change the point count, impulses, etc.
 * The radii must come from the shapes that generated the manifold.
 * 
 * @param {WorldManifold} [wm]
 */
Manifold.prototype.getWorldManifold = function(wm, xfA, radiusA, xfB, radiusB) {
  if (this.pointCount == 0) {
    return;
  }

  wm = wm || new WorldManifold();

  var normal = wm.normal;
  var points = wm.points;
  var separations = wm.separations;

  // TODO: improve
  switch (this.type) {
  case Manifold.e_circles:
    normal = Vec2.neo(1.0, 0.0);
    var pointA = Transform.mulVec2(xfA, this.localPoint);
    var pointB = Transform.mulVec2(xfB, this.points[0].localPoint);
    var dist = Vec2.sub(pointB, pointA);
    if (Vec2.lengthSquared(dist) > Math.EPSILON * Math.EPSILON) {
      normal.set(dist);
      normal.normalize();
    }
    var cA = pointA.clone().addMul(radiusA, normal);
    var cB = pointB.clone().addMul(-radiusB, normal);
    points[0] = Vec2.mid(cA, cB);
    separations[0] = Vec2.dot(Vec2.sub(cB, cA), normal);
    points.length = 1;
    separations.length = 1;
    break;

  case Manifold.e_faceA:
    normal = Rot.mulVec2(xfA.q, this.localNormal);
    var planePoint = Transform.mulVec2(xfA, this.localPoint);

    for (var i = 0; i < this.pointCount; ++i) {
      var clipPoint = Transform.mulVec2(xfB, this.points[i].localPoint);
      var cA = Vec2.clone(clipPoint).addMul(radiusA - Vec2.dot(Vec2.sub(clipPoint, planePoint), normal), normal);
      var cB = Vec2.clone(clipPoint).subMul(radiusB, normal);
      points[i] = Vec2.mid(cA, cB);
      separations[i] = Vec2.dot(Vec2.sub(cB, cA), normal);
    }
    points.length = this.pointCount;
    separations.length = this.pointCount;
    break;

  case Manifold.e_faceB:
    normal = Rot.mulVec2(xfB.q, this.localNormal);
    var planePoint = Transform.mulVec2(xfB, this.localPoint);

    for (var i = 0; i < this.pointCount; ++i) {
      var clipPoint = Transform.mulVec2(xfA, this.points[i].localPoint);
      var cB = Vec2.combine(1, clipPoint, radiusB - Vec2.dot(Vec2.sub(clipPoint, planePoint), normal), normal);
      var cA = Vec2.combine(1, clipPoint, -radiusA, normal);
      points[i] = Vec2.mid(cA, cB);
      separations[i] = Vec2.dot(Vec2.sub(cA, cB), normal);
    }
    points.length = this.pointCount;
    separations.length = this.pointCount;
    // Ensure normal points from A to B.
    normal.mul(-1);
    break;
  }

  wm.normal = normal;
  wm.points = points;
  wm.separations = separations;
  return wm;
}

/**
 * This is used for determining the state of contact points.
 * 
 * @prop {0} nullState Point does not exist
 * @prop {1} addState Point was added in the update
 * @prop {2} persistState Point persisted across the update
 * @prop {3} removeState Point was removed in the update
 */
var PointState = {
  // TODO: use constants
  nullState : 0,
  addState : 1,
  persistState : 2,
  removeState : 3
};

/**
 * Compute the point states given two manifolds. The states pertain to the
 * transition from manifold1 to manifold2. So state1 is either persist or remove
 * while state2 is either add or persist.
 * 
 * @param {PointState[Settings.maxManifoldPoints]} state1
 * @param {PointState[Settings.maxManifoldPoints]} state2
 */
function getPointStates(state1, state2, manifold1, manifold2) {
  // for (var i = 0; i < Settings.maxManifoldPoints; ++i) {
  // state1[i] = PointState.nullState;
  // state2[i] = PointState.nullState;
  // }

  // Detect persists and removes.
  for (var i = 0; i < manifold1.pointCount; ++i) {
    var id = manifold1.points[i].id;// ContactID

    state1[i] = PointState.removeState;

    for (var j = 0; j < manifold2.pointCount; ++j) {
      if (manifold2.points[j].id.key == id.key) {
        state1[i] = PointState.persistState;
        break;
      }
    }
  }

  // Detect persists and adds.
  for (var i = 0; i < manifold2.pointCount; ++i) {
    var id = manifold2.points[i].id;// ContactID

    state2[i] = PointState.addState;

    for (var j = 0; j < manifold1.pointCount; ++j) {
      if (manifold1.points[j].id.key == id.key) {
        state2[i] = PointState.persistState;
        break;
      }
    }
  }
}

/**
 * Used for computing contact manifolds.
 * 
 * @prop {Vec2} v
 * @prop {ContactID} id
 */
function ClipVertex() {
  this.v = Vec2.zero();
  this.id = new ContactID();
};

ClipVertex.prototype.set = function(o) {
  this.v.set(o.v);
  this.id.set(o.id);
};

/**
 * Clipping for contact manifolds. Sutherland-Hodgman clipping.
 * 
 * @param {ClipVertex[2]} vOut
 * @param {ClipVertex[2]} vIn
 */
function clipSegmentToLine(vOut, vIn, normal, offset, vertexIndexA) {
  // Start with no output points
  var numOut = 0;

  // Calculate the distance of end points to the line
  var distance0 = Vec2.dot(normal, vIn[0].v) - offset;
  var distance1 = Vec2.dot(normal, vIn[1].v) - offset;

  // If the points are behind the plane
  if (distance0 <= 0.0)
    vOut[numOut++].set(vIn[0]);
  if (distance1 <= 0.0)
    vOut[numOut++].set(vIn[1]);

  // If the points are on different sides of the plane
  if (distance0 * distance1 < 0.0) {
    // Find intersection point of edge and plane
    var interp = distance0 / (distance0 - distance1);
    vOut[numOut].v.setCombine(1 - interp, vIn[0].v, interp, vIn[1].v);

    // VertexA is hitting edgeB.
    vOut[numOut].id.cf.indexA = vertexIndexA;
    vOut[numOut].id.cf.indexB = vIn[0].id.cf.indexB;
    vOut[numOut].id.cf.typeA = Manifold.e_vertex;
    vOut[numOut].id.cf.typeB = Manifold.e_face;
    ++numOut;
  }

  return numOut;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/Settings.js":
/*!****************************************************!*\
  !*** ../../node_modules/planck-js/lib/Settings.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

// TODO merge with World options?

var Settings = exports;

/**
 * Tuning constants based on meters-kilograms-seconds (MKS) units.
 */

// Collision
/**
 * The maximum number of contact points between two convex shapes. Do not change
 * this value.
 */
Settings.maxManifoldPoints = 2;

/**
 * The maximum number of vertices on a convex polygon. You cannot increase this
 * too much because BlockAllocator has a maximum object size.
 */
Settings.maxPolygonVertices = 12;

/**
 * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
 * by a small amount without triggering a tree adjustment. This is in meters.
 */
Settings.aabbExtension = 0.1;

/**
 * This is used to fatten AABBs in the dynamic tree. This is used to predict the
 * future position based on the current displacement. This is a dimensionless
 * multiplier.
 */
Settings.aabbMultiplier = 2.0;

/**
 * A small length used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
Settings.linearSlop = 0.005;
Settings.linearSlopSquared = Settings.linearSlop * Settings.linearSlop;

/**
 * A small angle used as a collision and constraint tolerance. Usually it is
 * chosen to be numerically significant, but visually insignificant.
 */
Settings.angularSlop = (2.0 / 180.0 * Math.PI);

/**
 * The radius of the polygon/edge shape skin. This should not be modified.
 * Making this smaller means polygons will have an insufficient buffer for
 * continuous collision. Making it larger may create artifacts for vertex
 * collision.
 */
Settings.polygonRadius = (2.0 * Settings.linearSlop);

/**
 * Maximum number of sub-steps per contact in continuous physics simulation.
 */
Settings.maxSubSteps = 8;

// Dynamics

/**
 * Maximum number of contacts to be handled to solve a TOI impact.
 */
Settings.maxTOIContacts = 32;

/**
 * Maximum iterations to solve a TOI.
 */
Settings.maxTOIIterations = 20;

/**
 * Maximum iterations to find Distance.
 */
Settings.maxDistnceIterations = 20;

/**
 * A velocity threshold for elastic collisions. Any collision with a relative
 * linear velocity below this threshold will be treated as inelastic.
 */
Settings.velocityThreshold = 1.0;

/**
 * The maximum linear position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
Settings.maxLinearCorrection = 0.2;

/**
 * The maximum angular position correction used when solving constraints. This
 * helps to prevent overshoot.
 */
Settings.maxAngularCorrection = (8.0 / 180.0 * Math.PI);

/**
 * The maximum linear velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
Settings.maxTranslation = 2.0;
Settings.maxTranslationSquared = (Settings.maxTranslation * Settings.maxTranslation);

/**
 * The maximum angular velocity of a body. This limit is very large and is used
 * to prevent numerical problems. You shouldn't need to adjust this.
 */
Settings.maxRotation = (0.5 * Math.PI)
Settings.maxRotationSquared = (Settings.maxRotation * Settings.maxRotation)

/**
 * This scale factor controls how fast overlap is resolved. Ideally this would
 * be 1 so that overlap is removed in one time step. However using values close
 * to 1 often lead to overshoot.
 */
Settings.baumgarte = 0.2;
Settings.toiBaugarte = 0.75;

// Sleep

/**
 * The time that a body must be still before it will go to sleep.
 */
Settings.timeToSleep = 0.5;

/**
 * A body cannot sleep if its linear velocity is above this tolerance.
 */
Settings.linearSleepTolerance = 0.01;

Settings.linearSleepToleranceSqr = Math.pow(Settings.linearSleepTolerance, 2);

/**
 * A body cannot sleep if its angular velocity is above this tolerance.
 */
Settings.angularSleepTolerance = (2.0 / 180.0 * Math.PI);

Settings.angularSleepToleranceSqr = Math.pow(Settings.angularSleepTolerance, 2);



/***/ }),

/***/ "../../node_modules/planck-js/lib/Shape.js":
/*!*************************************************!*\
  !*** ../../node_modules/planck-js/lib/Shape.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Shape;

var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");

/**
 * A shape is used for collision detection. You can create a shape however you
 * like. Shapes used for simulation in World are created automatically when a
 * Fixture is created. Shapes may encapsulate one or more child shapes.
 */
function Shape() {
  this.m_type;
  this.m_radius;
}

Shape.prototype._reset = function() {
};

Shape.prototype._serialize = function() {
  return {};
};

Shape.TYPES = {};

Shape._deserialize = function(data, context, restore) {
  var clazz = Shape.TYPES[data.type];
  return clazz && restore(clazz, data);
};

Shape.isValid = function(shape) {
  return !!shape;
};

Shape.prototype.getRadius = function() {
  return this.m_radius;
};

/**
 * Get the type of this shape. You can use this to down cast to the concrete
 * shape.
 * 
 * @return the shape type.
 */
Shape.prototype.getType = function() {
  return this.m_type;
};

/**
 * @deprecated Shapes should be treated as immutable.
 *
 * clone the concrete shape.
 */
Shape.prototype._clone = function() {
};

/**
 * // Get the number of child primitives.
 */
Shape.prototype.getChildCount = function() {
};

/**
 * Test a point for containment in this shape. This only works for convex
 * shapes.
 * 
 * @param {Transform} xf The shape world transform.
 * @param p A point in world coordinates.
 */
Shape.prototype.testPoint = function(xf, p) {
};

/**
 * Cast a ray against a child shape.
 * 
 * @param {RayCastOutput} output The ray-cast results.
 * @param {RayCastInput} input The ray-cast input parameters.
 * @param {Transform} transform The transform to be applied to the shape.
 * @param childIndex The child shape index
 */
Shape.prototype.rayCast = function(output, input, transform, childIndex) {
};

/**
 * Given a transform, compute the associated axis aligned bounding box for a
 * child shape.
 * 
 * @param {AABB} aabb Returns the axis aligned box.
 * @param {Transform} xf The world transform of the shape.
 * @param childIndex The child shape
 */
Shape.prototype.computeAABB = function(aabb, xf, childIndex) {
};

/**
 * Compute the mass properties of this shape using its dimensions and density.
 * The inertia tensor is computed about the local origin.
 * 
 * @param {MassData} massData Returns the mass data for this shape.
 * @param density The density in kilograms per meter squared.
 */
Shape.prototype.computeMass = function(massData, density) {
};

/**
 * @param {DistanceProxy} proxy
 */
Shape.prototype.computeDistanceProxy = function(proxy) {
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/Solver.js":
/*!**************************************************!*\
  !*** ../../node_modules/planck-js/lib/Solver.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Solver;
module.exports.TimeStep = TimeStep;

var Settings = __webpack_require__(/*! ./Settings */ "../../node_modules/planck-js/lib/Settings.js");
var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");

var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");

var Body = __webpack_require__(/*! ./Body */ "../../node_modules/planck-js/lib/Body.js");
var Contact = __webpack_require__(/*! ./Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Joint = __webpack_require__(/*! ./Joint */ "../../node_modules/planck-js/lib/Joint.js");

var TimeOfImpact = __webpack_require__(/*! ./collision/TimeOfImpact */ "../../node_modules/planck-js/lib/collision/TimeOfImpact.js");
var TOIInput = TimeOfImpact.Input;
var TOIOutput = TimeOfImpact.Output;

var Distance = __webpack_require__(/*! ./collision/Distance */ "../../node_modules/planck-js/lib/collision/Distance.js");
var DistanceInput = Distance.Input;
var DistanceOutput = Distance.Output;
var DistanceProxy = Distance.Proxy;
var SimplexCache = Distance.Cache;

function TimeStep(dt) {
  this.dt = 0; // time step
  this.inv_dt = 0; // inverse time step (0 if dt == 0)
  this.velocityIterations = 0;
  this.positionIterations = 0;
  this.warmStarting = false;
  this.blockSolve = true;

  // timestep ratio for variable timestep
  this.inv_dt0 = 0.0;
  this.dtRatio = 1; // dt * inv_dt0
}

TimeStep.prototype.reset = function(dt) {
  if (this.dt > 0.0) {
    this.inv_dt0 = this.inv_dt;
  }
  this.dt = dt;
  this.inv_dt = dt == 0 ? 0 : 1 / dt;
  this.dtRatio = dt * this.inv_dt0;
}

/**
 * Finds and solves islands. An island is a connected subset of the world.
 * 
 * @param {World} world
 */
function Solver(world) {
  this.m_world = world;
  this.m_stack = [];
  this.m_bodies = [];
  this.m_contacts = [];
  this.m_joints = [];
}

Solver.prototype.clear = function() {
  this.m_stack.length = 0;
  this.m_bodies.length = 0;
  this.m_contacts.length = 0;
  this.m_joints.length = 0;
}

Solver.prototype.addBody = function(body) {
  _ASSERT && common.assert(body instanceof Body, 'Not a Body!', body);
  this.m_bodies.push(body);
  // why?
//  body.c_position.c.setZero();
//  body.c_position.a = 0;
//  body.c_velocity.v.setZero();
//  body.c_velocity.w = 0;
};

Solver.prototype.addContact = function(contact) {
  _ASSERT && common.assert(contact instanceof Contact, 'Not a Contact!', contact);
  this.m_contacts.push(contact);
};

Solver.prototype.addJoint = function(joint) {
  _ASSERT && common.assert(joint instanceof Joint, 'Not a Joint!', joint);
  this.m_joints.push(joint);
};

/**
 * @param {TimeStep} step
 */
Solver.prototype.solveWorld = function(step) {
  var world = this.m_world;

  // Clear all the island flags.
  for (var b = world.m_bodyList; b; b = b.m_next) {
    b.m_islandFlag = false;
  }
  for (var c = world.m_contactList; c; c = c.m_next) {
    c.m_islandFlag = false;
  }
  for (var j = world.m_jointList; j; j = j.m_next) {
    j.m_islandFlag = false;
  }

  // Build and simulate all awake islands.
  var stack = this.m_stack;
  var loop = -1;
  for (var seed = world.m_bodyList; seed; seed = seed.m_next) {
    loop++;
    if (seed.m_islandFlag) {
      continue;
    }

    if (seed.isAwake() == false || seed.isActive() == false) {
      continue;
    }

    // The seed can be dynamic or kinematic.
    if (seed.isStatic()) {
      continue;
    }

    // Reset island and stack.
    this.clear();

    stack.push(seed);

    seed.m_islandFlag = true;

    // Perform a depth first search (DFS) on the constraint graph.
    while (stack.length > 0) {
      // Grab the next body off the stack and add it to the island.
      var b = stack.pop();
      _ASSERT && common.assert(b.isActive() == true);
      this.addBody(b);

      // Make sure the body is awake.
      b.setAwake(true);

      // To keep islands as small as possible, we don't
      // propagate islands across static bodies.
      if (b.isStatic()) {
        continue;
      }
      
      // Search all contacts connected to this body.
      for (var ce = b.m_contactList; ce; ce = ce.next) {
        var contact = ce.contact;

        // Has this contact already been added to an island?
        if (contact.m_islandFlag) {
          continue;
        }

        // Is this contact solid and touching?
        if (contact.isEnabled() == false || contact.isTouching() == false) {
          continue;
        }

        // Skip sensors.
        var sensorA = contact.m_fixtureA.m_isSensor;
        var sensorB = contact.m_fixtureB.m_isSensor;
        if (sensorA || sensorB) {
          continue;
        }

        this.addContact(contact);
        contact.m_islandFlag = true;

        var other = ce.other;

        // Was the other body already added to this island?
        if (other.m_islandFlag) {
          continue;
        }

        // _ASSERT && common.assert(stack.length < world.m_bodyCount);
        stack.push(other);
        other.m_islandFlag = true;
      }

      // Search all joints connect to this body.
      for (var je = b.m_jointList; je; je = je.next) {
        if (je.joint.m_islandFlag == true) {
          continue;
        }

        var other = je.other;

        // Don't simulate joints connected to inactive bodies.
        if (other.isActive() == false) {
          continue;
        }

        this.addJoint(je.joint);
        je.joint.m_islandFlag = true;

        if (other.m_islandFlag) {
          continue;
        }

        // _ASSERT && common.assert(stack.length < world.m_bodyCount);
        stack.push(other);
        other.m_islandFlag = true;
      }
    }

    this.solveIsland(step);

    // Post solve cleanup.
    for (var i = 0; i < this.m_bodies.length; ++i) {
      // Allow static bodies to participate in other islands.
      // TODO: are they added at all?
      var b = this.m_bodies[i];
      if (b.isStatic()) {
        b.m_islandFlag = false;
      }
    }
  }
}

/**
 * @param {TimeStep} step
 */
Solver.prototype.solveIsland = function(step) {
  // B2: Island Solve
  var world = this.m_world;
  var gravity = world.m_gravity;
  var allowSleep = world.m_allowSleep;

  var h = step.dt;

  // Integrate velocities and apply damping. Initialize the body state.
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var body = this.m_bodies[i];

    var c = Vec2.clone(body.m_sweep.c);
    var a = body.m_sweep.a;
    var v = Vec2.clone(body.m_linearVelocity);
    var w = body.m_angularVelocity;

    // Store positions for continuous collision.
    body.m_sweep.c0.set(body.m_sweep.c);
    body.m_sweep.a0 = body.m_sweep.a;

    if (body.isDynamic()) {
      // Integrate velocities.
      v.addMul(h * body.m_gravityScale, gravity);
      v.addMul(h * body.m_invMass, body.m_force);
      w += h * body.m_invI * body.m_torque;
      /**
       * <pre>
       * Apply damping.
       * ODE: dv/dt + c * v = 0
       * Solution: v(t) = v0 * exp(-c * t)
       * Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
       * v2 = exp(-c * dt) * v1
       * Pade approximation:
       * v2 = v1 * 1 / (1 + c * dt)
       * </pre>
       */
      v.mul(1.0 / (1.0 + h * body.m_linearDamping));
      w *= 1.0 / (1.0 + h * body.m_angularDamping);
    }

    body.c_position.c = c;
    body.c_position.a = a;
    body.c_velocity.v = v;
    body.c_velocity.w = w;
  }

  for (var i = 0; i < this.m_contacts.length; ++i) {
    var contact = this.m_contacts[i];
    contact.initConstraint(step);
  }

  _DEBUG && this.printBodies('M: ');

  for (var i = 0; i < this.m_contacts.length; ++i) {
    var contact = this.m_contacts[i];
    contact.initVelocityConstraint(step);
  }

  _DEBUG && this.printBodies('R: ');

  if (step.warmStarting) {
    // Warm start.
    for (var i = 0; i < this.m_contacts.length; ++i) {
      var contact = this.m_contacts[i];
      contact.warmStartConstraint(step);
    }
  }

  _DEBUG && this.printBodies('Q: ');
  
  for (var i = 0; i < this.m_joints.length; ++i) {
    var joint = this.m_joints[i];
    joint.initVelocityConstraints(step);
  }

  _DEBUG && this.printBodies('E: ');

  // Solve velocity constraints
  for (var i = 0; i < step.velocityIterations; ++i) {
    for (var j = 0; j < this.m_joints.length; ++j) {
      var joint = this.m_joints[j];
      joint.solveVelocityConstraints(step);
    }

    for (var j = 0; j < this.m_contacts.length; ++j) {
      var contact = this.m_contacts[j];
      contact.solveVelocityConstraint(step);
    }
  }

  _DEBUG && this.printBodies('D: ');

  // Store impulses for warm starting
  for (var i = 0; i < this.m_contacts.length; ++i) {
    var contact = this.m_contacts[i];
    contact.storeConstraintImpulses(step);
  }

  _DEBUG && this.printBodies('C: ');

  // Integrate positions
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var body = this.m_bodies[i];

    var c = Vec2.clone(body.c_position.c);
    var a = body.c_position.a;
    var v = Vec2.clone(body.c_velocity.v);
    var w = body.c_velocity.w;

    // Check for large velocities
    var translation = Vec2.mul(h, v);
    if (Vec2.lengthSquared(translation) > Settings.maxTranslationSquared) {
      var ratio = Settings.maxTranslation / translation.length();
      v.mul(ratio);
    }

    var rotation = h * w;
    if (rotation * rotation > Settings.maxRotationSquared) {
      var ratio = Settings.maxRotation / Math.abs(rotation);
      w *= ratio;
    }

    // Integrate
    c.addMul(h, v);
    a += h * w;

    body.c_position.c.set(c);
    body.c_position.a = a;
    body.c_velocity.v.set(v);
    body.c_velocity.w = w;
  }

  _DEBUG && this.printBodies('B: ');

  // Solve position constraints
  var positionSolved = false;
  for (var i = 0; i < step.positionIterations; ++i) {
    var minSeparation = 0.0;
    for (var j = 0; j < this.m_contacts.length; ++j) {
      var contact = this.m_contacts[j];
      var separation = contact.solvePositionConstraint(step);
      minSeparation = Math.min(minSeparation, separation);
    }
    // We can't expect minSpeparation >= -Settings.linearSlop because we don't
    // push the separation above -Settings.linearSlop.
    var contactsOkay = minSeparation >= -3.0 * Settings.linearSlop;

    var jointsOkay = true;
    for (var j = 0; j < this.m_joints.length; ++j) {
      var joint = this.m_joints[j];
      var jointOkay = joint.solvePositionConstraints(step);
      jointsOkay = jointsOkay && jointOkay;
    }

    if (contactsOkay && jointsOkay) {
      // Exit early if the position errors are small.
      positionSolved = true;
      break;
    }
  }

  _DEBUG && this.printBodies('L: ');

  // Copy state buffers back to the bodies
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var body = this.m_bodies[i];

    body.m_sweep.c.set(body.c_position.c);
    body.m_sweep.a = body.c_position.a;
    body.m_linearVelocity.set(body.c_velocity.v);
    body.m_angularVelocity = body.c_velocity.w;
    body.synchronizeTransform();
  }

  this.postSolveIsland();

  if (allowSleep) {
    var minSleepTime = Infinity;

    var linTolSqr = Settings.linearSleepToleranceSqr;
    var angTolSqr = Settings.angularSleepToleranceSqr;

    for (var i = 0; i < this.m_bodies.length; ++i) {
      var body = this.m_bodies[i];
      if (body.isStatic()) {
        continue;
      }

      if ((body.m_autoSleepFlag == false)
          || (body.m_angularVelocity * body.m_angularVelocity > angTolSqr)
          || (Vec2.lengthSquared(body.m_linearVelocity) > linTolSqr)) {
        body.m_sleepTime = 0.0;
        minSleepTime = 0.0;
      } else {
        body.m_sleepTime += h;
        minSleepTime = Math.min(minSleepTime, body.m_sleepTime);
      }
    }

    if (minSleepTime >= Settings.timeToSleep && positionSolved) {
      for (var i = 0; i < this.m_bodies.length; ++i) {
        var body = this.m_bodies[i];
        body.setAwake(false);
      }
    }
  }
};

Solver.prototype.printBodies = function(tag) {
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var b = this.m_bodies[i];
    common.debug(tag, b.c_position.a, b.c_position.c.x, b.c_position.c.y, b.c_velocity.w, b.c_velocity.v.x, b.c_velocity.v.y);
  }
};

var s_subStep = new TimeStep(); // reuse

/**
 * Find TOI contacts and solve them.
 *
 * @param {TimeStep} step
 */
Solver.prototype.solveWorldTOI = function(step) {
  var world = this.m_world;

  if (world.m_stepComplete) {
    for (var b = world.m_bodyList; b; b = b.m_next) {
      b.m_islandFlag = false;
      b.m_sweep.alpha0 = 0.0;
    }

    for (var c = world.m_contactList; c; c = c.m_next) {
      // Invalidate TOI
      c.m_toiFlag = false;
      c.m_islandFlag = false;
      c.m_toiCount = 0;
      c.m_toi = 1.0;
    }
  }

  // Find TOI events and solve them.
  for (;;) {
    // Find the first TOI.
    var minContact = null; // Contact
    var minAlpha = 1.0;

    for (var c = world.m_contactList; c; c = c.m_next) {
      // Is this contact disabled?
      if (c.isEnabled() == false) {
        continue;
      }

      // Prevent excessive sub-stepping.
      if (c.m_toiCount > Settings.maxSubSteps) {
        continue;
      }

      var alpha = 1.0;
      if (c.m_toiFlag) {
        // This contact has a valid cached TOI.
        alpha = c.m_toi;
      } else {
        var fA = c.getFixtureA();
        var fB = c.getFixtureB();

        // Is there a sensor?
        if (fA.isSensor() || fB.isSensor()) {
          continue;
        }

        var bA = fA.getBody();
        var bB = fB.getBody();

        _ASSERT && common.assert(bA.isDynamic() || bB.isDynamic());

        var activeA = bA.isAwake() && !bA.isStatic();
        var activeB = bB.isAwake() && !bB.isStatic();

        // Is at least one body active (awake and dynamic or kinematic)?
        if (activeA == false && activeB == false) {
          continue;
        }

        var collideA = bA.isBullet() || !bA.isDynamic();
        var collideB = bB.isBullet() || !bB.isDynamic();

        // Are these two non-bullet dynamic bodies?
        if (collideA == false && collideB == false) {
          continue;
        }

        // Compute the TOI for this contact.
        // Put the sweeps onto the same time interval.
        var alpha0 = bA.m_sweep.alpha0;

        if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0) {
          alpha0 = bB.m_sweep.alpha0;
          bA.m_sweep.advance(alpha0);
        } else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0) {
          alpha0 = bA.m_sweep.alpha0;
          bB.m_sweep.advance(alpha0);
        }

        _ASSERT && common.assert(alpha0 < 1.0);

        var indexA = c.getChildIndexA();
        var indexB = c.getChildIndexB();

        var sweepA = bA.m_sweep;
        var sweepB = bB.m_sweep;

        // Compute the time of impact in interval [0, minTOI]
        var input = new TOIInput(); // TODO: reuse
        input.proxyA.set(fA.getShape(), indexA);
        input.proxyB.set(fB.getShape(), indexB);
        input.sweepA.set(bA.m_sweep);
        input.sweepB.set(bB.m_sweep);
        input.tMax = 1.0;

        var output = new TOIOutput(); // TODO: reuse
        TimeOfImpact(output, input);

        // Beta is the fraction of the remaining portion of the [time?].
        var beta = output.t;
        if (output.state == TOIOutput.e_touching) {
          alpha = Math.min(alpha0 + (1.0 - alpha0) * beta, 1.0);
        } else {
          alpha = 1.0;
        }

        c.m_toi = alpha;
        c.m_toiFlag = true;
      }

      if (alpha < minAlpha) {
        // This is the minimum TOI found so far.
        minContact = c;
        minAlpha = alpha;
      }
    }

    if (minContact == null || 1.0 - 10.0 * Math.EPSILON < minAlpha) {
      // No more TOI events. Done!
      world.m_stepComplete = true;
      break;
    }

    // Advance the bodies to the TOI.
    var fA = minContact.getFixtureA();
    var fB = minContact.getFixtureB();
    var bA = fA.getBody();
    var bB = fB.getBody();

    var backup1 = bA.m_sweep.clone();
    var backup2 = bB.m_sweep.clone();

    bA.advance(minAlpha);
    bB.advance(minAlpha);

    // The TOI contact likely has some new contact points.
    minContact.update(world);
    minContact.m_toiFlag = false;
    ++minContact.m_toiCount;

    // Is the contact solid?
    if (minContact.isEnabled() == false || minContact.isTouching() == false) {
      // Restore the sweeps.
      minContact.setEnabled(false);
      bA.m_sweep.set(backup1);
      bB.m_sweep.set(backup2);
      bA.synchronizeTransform();
      bB.synchronizeTransform();
      continue;
    }

    bA.setAwake(true);
    bB.setAwake(true);

    // Build the island
    this.clear();
    this.addBody(bA);
    this.addBody(bB);
    this.addContact(minContact);

    bA.m_islandFlag = true;
    bB.m_islandFlag = true;
    minContact.m_islandFlag = true;

    // Get contacts on bodyA and bodyB.
    var bodies = [ bA, bB ];
    for (var i = 0; i < bodies.length; ++i) {
      var body = bodies[i];
      if (body.isDynamic()) {
        for (var ce = body.m_contactList; ce; ce = ce.next) {
          // if (this.m_bodyCount == this.m_bodyCapacity) { break; }
          // if (this.m_contactCount == this.m_contactCapacity) { break; }

          var contact = ce.contact;

          // Has this contact already been added to the island?
          if (contact.m_islandFlag) {
            continue;
          }

          // Only add if either is static, kinematic or bullet.
          var other = ce.other;
          if (other.isDynamic() && !body.isBullet() && !other.isBullet()) {
            continue;
          }

          // Skip sensors.
          var sensorA = contact.m_fixtureA.m_isSensor;
          var sensorB = contact.m_fixtureB.m_isSensor;
          if (sensorA || sensorB) {
            continue;
          }

          // Tentatively advance the body to the TOI.
          var backup = other.m_sweep.clone();
          if (other.m_islandFlag == false) {
            other.advance(minAlpha);
          }

          // Update the contact points
          contact.update(world);

          // Was the contact disabled by the user?
          // Are there contact points?
          if (contact.isEnabled() == false || contact.isTouching() == false) {
            other.m_sweep.set(backup);
            other.synchronizeTransform();
            continue;
          }

          // Add the contact to the island
          contact.m_islandFlag = true;
          this.addContact(contact);

          // Has the other body already been added to the island?
          if (other.m_islandFlag) {
            continue;
          }

          // Add the other body to the island.
          other.m_islandFlag = true;

          if (!other.isStatic()) {
            other.setAwake(true);
          }

          this.addBody(other);
        }
      }
    }

    s_subStep.reset((1.0 - minAlpha) * step.dt);
    s_subStep.dtRatio = 1.0;
    s_subStep.positionIterations = 20;
    s_subStep.velocityIterations = step.velocityIterations;
    s_subStep.warmStarting = false;

    this.solveIslandTOI(s_subStep, bA, bB);

    // Reset island flags and synchronize broad-phase proxies.
    for (var i = 0; i < this.m_bodies.length; ++i) {
      var body = this.m_bodies[i];
      body.m_islandFlag = false;

      if (!body.isDynamic()) {
        continue;
      }

      body.synchronizeFixtures();

      // Invalidate all contact TOIs on this displaced body.
      for (var ce = body.m_contactList; ce; ce = ce.next) {
        ce.contact.m_toiFlag = false;
        ce.contact.m_islandFlag = false;
      }
    }

    // Commit fixture proxy movements to the broad-phase so that new contacts
    // are created.
    // Also, some contacts can be destroyed.
    world.findNewContacts();

    if (world.m_subStepping) {
      world.m_stepComplete = false;
      break;
    }
  }

  if (_DEBUG) for (var b = world.m_bodyList; b; b = b.m_next) {
    var c = b.m_sweep.c;
    var a = b.m_sweep.a;
    var v = b.m_linearVelocity;
    var w = b.m_angularVelocity;
  }
}

/**
 * @param {TimeStep} subStep
 * @param toiA
 * @param toiB
 */
Solver.prototype.solveIslandTOI = function(subStep, toiA, toiB) {
  var world = this.m_world;

  // Initialize the body state.
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var body = this.m_bodies[i];
    body.c_position.c.set(body.m_sweep.c);
    body.c_position.a = body.m_sweep.a;
    body.c_velocity.v.set(body.m_linearVelocity);
    body.c_velocity.w = body.m_angularVelocity;
  }

  for (var i = 0; i < this.m_contacts.length; ++i) {
    var contact = this.m_contacts[i];
    contact.initConstraint(subStep);
  }

  // Solve position constraints.
  for (var i = 0; i < subStep.positionIterations; ++i) {
    var minSeparation = 0.0;
    for (var j = 0; j < this.m_contacts.length; ++j) {
      var contact = this.m_contacts[j];
      var separation = contact.solvePositionConstraintTOI(subStep, toiA, toiB);
      minSeparation = Math.min(minSeparation, separation);
    }
    // We can't expect minSpeparation >= -Settings.linearSlop because we don't
    // push the separation above -Settings.linearSlop.
    var contactsOkay = minSeparation >= -1.5 * Settings.linearSlop;
    if (contactsOkay) {
      break;
    }
  }

  if (false) { var cache, output, input, indexB, indexA, bB, bA, fB, fA, c, i; }

  // Leap of faith to new safe state.
  toiA.m_sweep.c0.set(toiA.c_position.c);
  toiA.m_sweep.a0 = toiA.c_position.a;
  toiB.m_sweep.c0.set(toiB.c_position.c);
  toiB.m_sweep.a0 = toiB.c_position.a;

  // No warm starting is needed for TOI events because warm
  // starting impulses were applied in the discrete solver.
  for (var i = 0; i < this.m_contacts.length; ++i) {
    var contact = this.m_contacts[i];
    contact.initVelocityConstraint(subStep);
  }

  // Solve velocity constraints.
  for (var i = 0; i < subStep.velocityIterations; ++i) {
    for (var j = 0; j < this.m_contacts.length; ++j) {
      var contact = this.m_contacts[j];
      contact.solveVelocityConstraint(subStep);
    }
  }

  // Don't store the TOI contact forces for warm starting
  // because they can be quite large.

  var h = subStep.dt;

  // Integrate positions
  for (var i = 0; i < this.m_bodies.length; ++i) {
    var body = this.m_bodies[i];

    var c = Vec2.clone(body.c_position.c);
    var a = body.c_position.a;
    var v = Vec2.clone(body.c_velocity.v);
    var w = body.c_velocity.w;

    // Check for large velocities
    var translation = Vec2.mul(h, v);
    if (Vec2.dot(translation, translation) > Settings.maxTranslationSquared) {
      var ratio = Settings.maxTranslation / translation.length();
      v.mul(ratio);
    }

    var rotation = h * w;
    if (rotation * rotation > Settings.maxRotationSquared) {
      var ratio = Settings.maxRotation / Math.abs(rotation);
      w *= ratio;
    }

    // Integrate
    c.addMul(h, v);
    a += h * w;

    body.c_position.c = c;
    body.c_position.a = a;
    body.c_velocity.v = v;
    body.c_velocity.w = w;

    // Sync bodies
    body.m_sweep.c = c;
    body.m_sweep.a = a;
    body.m_linearVelocity = v;
    body.m_angularVelocity = w;
    body.synchronizeTransform();
  }

  this.postSolveIsland();
};

/**
 * Contact impulses for reporting. Impulses are used instead of forces because
 * sub-step forces may approach infinity for rigid body collisions. These match
 * up one-to-one with the contact points in Manifold.
 */
function ContactImpulse() {
  this.normalImpulses = [];
  this.tangentImpulses = [];
};

Solver.prototype.postSolveIsland = function() {
  // TODO: report contact.v_points instead of new object?
  var impulse = new ContactImpulse();
  for (var c = 0; c < this.m_contacts.length; ++c) {
    var contact = this.m_contacts[c];
    for (var p = 0; p < contact.v_points.length; ++p) {
      impulse.normalImpulses.push(contact.v_points[p].normalImpulse);
      impulse.tangentImpulses.push(contact.v_points[p].tangentImpulse);
    }
    this.m_world.postSolve(contact, impulse);
  }
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/World.js":
/*!*************************************************!*\
  !*** ../../node_modules/planck-js/lib/World.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = World;

var options = __webpack_require__(/*! ./util/options */ "../../node_modules/planck-js/lib/util/options.js");
var common = __webpack_require__(/*! ./util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var BroadPhase = __webpack_require__(/*! ./collision/BroadPhase */ "../../node_modules/planck-js/lib/collision/BroadPhase.js");
var Solver = __webpack_require__(/*! ./Solver */ "../../node_modules/planck-js/lib/Solver.js");
var Body = __webpack_require__(/*! ./Body */ "../../node_modules/planck-js/lib/Body.js");
var Joint = __webpack_require__(/*! ./Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Contact = __webpack_require__(/*! ./Contact */ "../../node_modules/planck-js/lib/Contact.js");

/**
 * @typedef {Object} WorldDef
 *
 * @prop {Vec2} [gravity = { x : 0, y : 0}]
 * @prop {boolean} [allowSleep = true]
 * @prop {boolean} [warmStarting = true]
 * @prop {boolean} [continuousPhysics = true]
 * @prop {boolean} [subStepping = false]
 * @prop {boolean} [blockSolve = true]
 * @prop {int} [velocityIterations = 8] For the velocity constraint solver.
 * @prop {int} [positionIterations = 3] For the position constraint solver.
 */
var WorldDef = {
  gravity : Vec2.zero(),
  allowSleep : true,
  warmStarting : true,
  continuousPhysics : true,
  subStepping : false,
  blockSolve : true,
  velocityIterations : 8,
  positionIterations : 3
};

/**
 * @param {WorldDef|Vec2} def World definition or gravity vector.
 */
function World(def) {
  if (!(this instanceof World)) {
    return new World(def);
  }

  if (def && Vec2.isValid(def)) {
    def = {gravity : def};
  }

  def = options(def, WorldDef);

  this.m_solver = new Solver(this);

  this.m_broadPhase = new BroadPhase();

  this.m_contactList = null;
  this.m_contactCount = 0;

  this.m_bodyList = null;
  this.m_bodyCount = 0;

  this.m_jointList = null;
  this.m_jointCount = 0;

  this.m_stepComplete = true;

  this.m_allowSleep = def.allowSleep;
  this.m_gravity = Vec2.clone(def.gravity);

  this.m_clearForces = true;
  this.m_newFixture = false;
  this.m_locked = false;

  // These are for debugging the solver.
  this.m_warmStarting = def.warmStarting;
  this.m_continuousPhysics = def.continuousPhysics;
  this.m_subStepping = def.subStepping;

  this.m_blockSolve = def.blockSolve;
  this.m_velocityIterations = def.velocityIterations;
  this.m_positionIterations = def.positionIterations;

  this.m_t = 0;

  // Broad-phase callback.
  this.addPair = this.createContact.bind(this);
}

World.prototype._serialize = function() {
  var bodies = [];
  var joints = [];

  for (var b = this.getBodyList(); b; b = b.getNext()) {
    bodies.push(b);
  }

  for (var j = this.getJointList(); j; j = j.getNext()) {
    if (typeof j._serialize === 'function') {
      joints.push(j);
    }
  }

  return {
    gravity: this.m_gravity,
    bodies: bodies,
    joints: joints,
  };
};

World._deserialize = function(data, context, restore) {
  if (!data) {
    return new World();
  }

  var world = new World(data.gravity);

  if (data.bodies) {
    for(var i = data.bodies.length - 1; i >= 0; i -= 1) {
      world._addBody(restore(Body, data.bodies[i], world));
    }
  }

  if (data.joints) {
    for(var i = data.joints.length - 1; i >= 0; i--) {
      world.createJoint(restore(Joint, data.joints[i], world));
    }
  }

  return world;
};

/**
 * Get the world body list. With the returned body, use Body.getNext to get the
 * next body in the world list. A null body indicates the end of the list.
 *
 * @return the head of the world body list.
 */
World.prototype.getBodyList = function() {
  return this.m_bodyList;
}

/**
 * Get the world joint list. With the returned joint, use Joint.getNext to get
 * the next joint in the world list. A null joint indicates the end of the list.
 *
 * @return the head of the world joint list.
 */
World.prototype.getJointList = function() {
  return this.m_jointList;
}

/**
 * Get the world contact list. With the returned contact, use Contact.getNext to
 * get the next contact in the world list. A null contact indicates the end of
 * the list.
 *
 * @return the head of the world contact list. Warning: contacts are created and
 *         destroyed in the middle of a time step. Use ContactListener to avoid
 *         missing contacts.
 */
World.prototype.getContactList = function() {
  return this.m_contactList;
}

World.prototype.getBodyCount = function() {
  return this.m_bodyCount;
}

World.prototype.getJointCount = function() {
  return this.m_jointCount;
}

/**
 * Get the number of contacts (each may have 0 or more contact points).
 */
World.prototype.getContactCount = function() {
  return this.m_contactCount;
}

/**
 * Change the global gravity vector.
 */
World.prototype.setGravity = function(gravity) {
  this.m_gravity = gravity;
}

/**
 * Get the global gravity vector.
 */
World.prototype.getGravity = function() {
  return this.m_gravity;
}

/**
 * Is the world locked (in the middle of a time step).
 */
World.prototype.isLocked = function() {
  return this.m_locked;
}

/**
 * Enable/disable sleep.
 */
World.prototype.setAllowSleeping = function(flag) {
  if (flag == this.m_allowSleep) {
    return;
  }

  this.m_allowSleep = flag;
  if (this.m_allowSleep == false) {
    for (var b = this.m_bodyList; b; b = b.m_next) {
      b.setAwake(true);
    }
  }
}

World.prototype.getAllowSleeping = function() {
  return this.m_allowSleep;
}

/**
 * Enable/disable warm starting. For testing.
 */
World.prototype.setWarmStarting = function(flag) {
  this.m_warmStarting = flag;
}

World.prototype.getWarmStarting = function() {
  return this.m_warmStarting;
}

/**
 * Enable/disable continuous physics. For testing.
 */
World.prototype.setContinuousPhysics = function(flag) {
  this.m_continuousPhysics = flag;
}

World.prototype.getContinuousPhysics = function() {
  return this.m_continuousPhysics;
}

/**
 * Enable/disable single stepped continuous physics. For testing.
 */
World.prototype.setSubStepping = function(flag) {
  this.m_subStepping = flag;
}

World.prototype.getSubStepping = function() {
  return this.m_subStepping;
}

/**
 * Set flag to control automatic clearing of forces after each time step.
 */
World.prototype.setAutoClearForces = function(flag) {
  this.m_clearForces = flag;
}

/**
 * Get the flag that controls automatic clearing of forces after each time step.
 */
World.prototype.getAutoClearForces = function() {
  return this.m_clearForces;
}

/**
 * Manually clear the force buffer on all bodies. By default, forces are cleared
 * automatically after each call to step. The default behavior is modified by
 * calling setAutoClearForces. The purpose of this function is to support
 * sub-stepping. Sub-stepping is often used to maintain a fixed sized time step
 * under a variable frame-rate. When you perform sub-stepping you will disable
 * auto clearing of forces and instead call clearForces after all sub-steps are
 * complete in one pass of your game loop.
 *
 * @see setAutoClearForces
 */
World.prototype.clearForces = function() {
  for (var body = this.m_bodyList; body; body = body.getNext()) {
    body.m_force.setZero();
    body.m_torque = 0.0;
  }
}

/**
 * @function World~rayCastCallback
 *
 * @param fixture
 */

/**
 * Query the world for all fixtures that potentially overlap the provided AABB.
 *
 * @param {World~queryCallback} queryCallback Called for each fixture
 *          found in the query AABB. It may return `false` to terminate the
 *          query.
 *
 * @param aabb The query box.
 */
World.prototype.queryAABB = function(aabb, queryCallback) {
  _ASSERT && common.assert(typeof queryCallback === 'function');
  var broadPhase = this.m_broadPhase;
  this.m_broadPhase.query(aabb, function(proxyId) { //TODO GC
    var proxy = broadPhase.getUserData(proxyId); // FixtureProxy
    return queryCallback(proxy.fixture);
  });
}

/**
 * @function World~rayCastCallback
 *
 * Callback class for ray casts. See World.rayCast
 *
 * Called for each fixture found in the query. You control how the ray cast
 * proceeds by returning a float: return -1: ignore this fixture and continue
 * return 0: terminate the ray cast return fraction: clip the ray to this point
 * return 1: don't clip the ray and continue
 *
 * @param fixture The fixture hit by the ray
 * @param point The point of initial intersection
 * @param normal The normal vector at the point of intersection
 * @param fraction
 *
 * @return {float} -1 to filter, 0 to terminate, fraction to clip the ray for
 *         closest hit, 1 to continue
 */

/**
 *
 * Ray-cast the world for all fixtures in the path of the ray. Your callback
 * controls whether you get the closest point, any point, or n-points. The
 * ray-cast ignores shapes that contain the starting point.
 *
 * @param {World~RayCastCallback} reportFixtureCallback A user implemented
 *          callback function.
 * @param point1 The ray starting point
 * @param point2 The ray ending point
 */
World.prototype.rayCast = function(point1, point2, reportFixtureCallback) {
  _ASSERT && common.assert(typeof reportFixtureCallback === 'function');
  var broadPhase = this.m_broadPhase;

  this.m_broadPhase.rayCast({
    maxFraction : 1.0,
    p1 : point1,
    p2 : point2
  }, function(input, proxyId) { // TODO GC
    var proxy = broadPhase.getUserData(proxyId); // FixtureProxy
    var fixture = proxy.fixture;
    var index = proxy.childIndex;
    var output = {}; // TODO GC
    var hit = fixture.rayCast(output, input, index);
    if (hit) {
      var fraction = output.fraction;
      var point = Vec2.add(Vec2.mul((1.0 - fraction), input.p1), Vec2.mul(fraction, input.p2));
      return reportFixtureCallback(fixture, point, output.normal, fraction);
    }
    return input.maxFraction;
  });
}

/**
 * Get the number of broad-phase proxies.
 */
World.prototype.getProxyCount = function() {
  return this.m_broadPhase.getProxyCount();
}

/**
 * Get the height of broad-phase dynamic tree.
 */
World.prototype.getTreeHeight = function() {
  return this.m_broadPhase.getTreeHeight();
}

/**
 * Get the balance of broad-phase dynamic tree.
 *
 * @returns {int}
 */
World.prototype.getTreeBalance = function() {
  return this.m_broadPhase.getTreeBalance();
}

/**
 * Get the quality metric of broad-phase dynamic tree. The smaller the better.
 * The minimum is 1.
 *
 * @returns {float}
 */
World.prototype.getTreeQuality = function() {
  return this.m_broadPhase.getTreeQuality();
}

/**
 * Shift the world origin. Useful for large worlds. The body shift formula is:
 * position -= newOrigin
 *
 * @param {Vec2} newOrigin The new origin with respect to the old origin
 */
World.prototype.shiftOrigin = function(newOrigin) {
  _ASSERT && common.assert(this.m_locked == false);
  if (this.m_locked) {
    return;
  }

  for (var b = this.m_bodyList; b; b = b.m_next) {
    b.m_xf.p.sub(newOrigin);
    b.m_sweep.c0.sub(newOrigin);
    b.m_sweep.c.sub(newOrigin);
  }

  for (var j = this.m_jointList; j; j = j.m_next) {
    j.shiftOrigin(newOrigin);
  }

  this.m_broadPhase.shiftOrigin(newOrigin);
}

/**
 * @internal Used for deserialize.
 */
World.prototype._addBody = function(body) {
  _ASSERT && common.assert(this.isLocked() === false);
  if (this.isLocked()) {
    return;
  }

  // Add to world doubly linked list.
  body.m_prev = null;
  body.m_next = this.m_bodyList;
  if (this.m_bodyList) {
    this.m_bodyList.m_prev = body;
  }
  this.m_bodyList = body;
  ++this.m_bodyCount;
}

/**
 * Create a rigid body given a definition. No reference to the definition is
 * retained.
 *
 * Warning: This function is locked during callbacks.
 *
 * @param {BodyDef|Vec2} def Body definition or position.
 * @param {float} angle Body angle if def is position.
 */
World.prototype.createBody = function(def, angle) {
  _ASSERT && common.assert(this.isLocked() == false);
  if (this.isLocked()) {
    return null;
  }

  if (def && Vec2.isValid(def)) {
    def = {
      position : def,
      angle : angle
    };
  }

  var body = new Body(this, def);

  this._addBody(body);

  return body;
}

World.prototype.createDynamicBody = function(def, angle) {
  if (!def) {
    def = {};
  } else if (Vec2.isValid(def)) {
    def = { position : def, angle : angle };
  }
  def.type = 'dynamic';
  return this.createBody(def);
}

World.prototype.createKinematicBody = function(def, angle) {
  if (!def) {
    def = {};
  } else if (Vec2.isValid(def)) {
    def = { position : def, angle : angle };
  }
  def.type = 'kinematic';
  return this.createBody(def);
}

/**
 * Destroy a rigid body given a definition. No reference to the definition is
 * retained.
 *
 * Warning: This automatically deletes all associated shapes and joints.
 *
 * Warning: This function is locked during callbacks.
 *
 * @param {Body} b
 */
World.prototype.destroyBody = function(b) {
  _ASSERT && common.assert(this.m_bodyCount > 0);
  _ASSERT && common.assert(this.isLocked() == false);
  if (this.isLocked()) {
    return;
  }

  if (b.m_destroyed) {
    return false;
  }

  // Delete the attached joints.
  var je = b.m_jointList;
  while (je) {
    var je0 = je;
    je = je.next;

    this.publish('remove-joint', je0.joint);
    this.destroyJoint(je0.joint);

    b.m_jointList = je;
  }
  b.m_jointList = null;

  // Delete the attached contacts.
  var ce = b.m_contactList;
  while (ce) {
    var ce0 = ce;
    ce = ce.next;

    this.destroyContact(ce0.contact);

    b.m_contactList = ce;
  }
  b.m_contactList = null;

  // Delete the attached fixtures. This destroys broad-phase proxies.
  var f = b.m_fixtureList;
  while (f) {
    var f0 = f;
    f = f.m_next;

    this.publish('remove-fixture', f0);
    f0.destroyProxies(this.m_broadPhase);

    b.m_fixtureList = f;
  }
  b.m_fixtureList = null;

  // Remove world body list.
  if (b.m_prev) {
    b.m_prev.m_next = b.m_next;
  }

  if (b.m_next) {
    b.m_next.m_prev = b.m_prev;
  }

  if (b == this.m_bodyList) {
    this.m_bodyList = b.m_next;
  }

  b.m_destroyed = true;

  --this.m_bodyCount;

  this.publish('remove-body', b);

  return true;
}

/**
 * Create a joint to constrain bodies together. No reference to the definition
 * is retained. This may cause the connected bodies to cease colliding.
 *
 * Warning: This function is locked during callbacks.
 *
 * @param {Joint} join
 * @param {Body} bodyB
 * @param {Body} bodyA
 */
World.prototype.createJoint = function(joint) {
  _ASSERT && common.assert(!!joint.m_bodyA);
  _ASSERT && common.assert(!!joint.m_bodyB);
  _ASSERT && common.assert(this.isLocked() == false);
  if (this.isLocked()) {
    return null;
  }

  // Connect to the world list.
  joint.m_prev = null;
  joint.m_next = this.m_jointList;
  if (this.m_jointList) {
    this.m_jointList.m_prev = joint;
  }
  this.m_jointList = joint;
  ++this.m_jointCount;

  // Connect to the bodies' doubly linked lists.
  joint.m_edgeA.joint = joint;
  joint.m_edgeA.other = joint.m_bodyB;
  joint.m_edgeA.prev = null;
  joint.m_edgeA.next = joint.m_bodyA.m_jointList;
  if (joint.m_bodyA.m_jointList)
    joint.m_bodyA.m_jointList.prev = joint.m_edgeA;
  joint.m_bodyA.m_jointList = joint.m_edgeA;

  joint.m_edgeB.joint = joint;
  joint.m_edgeB.other = joint.m_bodyA;
  joint.m_edgeB.prev = null;
  joint.m_edgeB.next = joint.m_bodyB.m_jointList;
  if (joint.m_bodyB.m_jointList)
    joint.m_bodyB.m_jointList.prev = joint.m_edgeB;
  joint.m_bodyB.m_jointList = joint.m_edgeB;

  // If the joint prevents collisions, then flag any contacts for filtering.
  if (joint.m_collideConnected == false) {
    for (var edge = joint.m_bodyB.getContactList(); edge; edge = edge.next) {
      if (edge.other == joint.m_bodyA) {
        // Flag the contact for filtering at the next time step (where either
        // body is awake).
        edge.contact.flagForFiltering();
      }
    }
  }

  // Note: creating a joint doesn't wake the bodies.

  return joint;
}

/**
 * Destroy a joint. This may cause the connected bodies to begin colliding.
 * Warning: This function is locked during callbacks.
 *
 * @param {Joint} join
 */
World.prototype.destroyJoint = function(joint) {
  _ASSERT && common.assert(this.isLocked() == false);
  if (this.isLocked()) {
    return;
  }

  // Remove from the doubly linked list.
  if (joint.m_prev) {
    joint.m_prev.m_next = joint.m_next;
  }

  if (joint.m_next) {
    joint.m_next.m_prev = joint.m_prev;
  }

  if (joint == this.m_jointList) {
    this.m_jointList = joint.m_next;
  }

  // Disconnect from bodies.
  var bodyA = joint.m_bodyA;
  var bodyB = joint.m_bodyB;

  // Wake up connected bodies.
  bodyA.setAwake(true);
  bodyB.setAwake(true);

  // Remove from body 1.
  if (joint.m_edgeA.prev) {
    joint.m_edgeA.prev.next = joint.m_edgeA.next;
  }

  if (joint.m_edgeA.next) {
    joint.m_edgeA.next.prev = joint.m_edgeA.prev;
  }

  if (joint.m_edgeA == bodyA.m_jointList) {
    bodyA.m_jointList = joint.m_edgeA.next;
  }

  joint.m_edgeA.prev = null;
  joint.m_edgeA.next = null;

  // Remove from body 2
  if (joint.m_edgeB.prev) {
    joint.m_edgeB.prev.next = joint.m_edgeB.next;
  }

  if (joint.m_edgeB.next) {
    joint.m_edgeB.next.prev = joint.m_edgeB.prev;
  }

  if (joint.m_edgeB == bodyB.m_jointList) {
    bodyB.m_jointList = joint.m_edgeB.next;
  }

  joint.m_edgeB.prev = null;
  joint.m_edgeB.next = null;

  _ASSERT && common.assert(this.m_jointCount > 0);
  --this.m_jointCount;

  // If the joint prevents collisions, then flag any contacts for filtering.
  if (joint.m_collideConnected == false) {
    var edge = bodyB.getContactList();
    while (edge) {
      if (edge.other == bodyA) {
        // Flag the contact for filtering at the next time step (where either
        // body is awake).
        edge.contact.flagForFiltering();
      }

      edge = edge.next;
    }
  }

  this.publish('remove-joint', joint);
}

var s_step = new Solver.TimeStep(); // reuse

/**
 * Take a time step. This performs collision detection, integration, and
 * constraint solution.
 *
 * Broad-phase, narrow-phase, solve and solve time of impacts.
 *
 * @param {float} timeStep Time step, this should not vary.
 * @param {int} velocityIterations
 * @param {int} positionIterations
 */
World.prototype.step = function(timeStep, velocityIterations, positionIterations) {
  this.publish('pre-step', timeStep);

  if ((velocityIterations | 0) !== velocityIterations) {
    // TODO: remove this in future
    velocityIterations = 0;
  }

  velocityIterations = velocityIterations || this.m_velocityIterations;
  positionIterations = positionIterations || this.m_positionIterations;

  // If new fixtures were added, we need to find the new contacts.
  if (this.m_newFixture) {
    this.findNewContacts();
    this.m_newFixture = false;
  }

  this.m_locked = true;

  s_step.reset(timeStep);
  s_step.velocityIterations = velocityIterations;
  s_step.positionIterations = positionIterations;
  s_step.warmStarting = this.m_warmStarting;
  s_step.blockSolve = this.m_blockSolve;

  // Update contacts. This is where some contacts are destroyed.
  this.updateContacts();

  // Integrate velocities, solve velocity constraints, and integrate positions.
  if (this.m_stepComplete && timeStep > 0.0) {
    this.m_solver.solveWorld(s_step);

    // Synchronize fixtures, check for out of range bodies.
    for (var b = this.m_bodyList; b; b = b.getNext()) {
      // If a body was not in an island then it did not move.
      if (b.m_islandFlag == false) {
        continue;
      }

      if (b.isStatic()) {
        continue;
      }

      // Update fixtures (for broad-phase).
      b.synchronizeFixtures();
    }
    // Look for new contacts.
    this.findNewContacts();
  }

  // Handle TOI events.
  if (this.m_continuousPhysics && timeStep > 0.0) {
    this.m_solver.solveWorldTOI(s_step);
  }

  if (this.m_clearForces) {
    this.clearForces();
  }

  this.m_locked = false;

  this.publish('post-step', timeStep);
}

/**
 * Call this method to find new contacts.
 */
World.prototype.findNewContacts = function() {
  this.m_broadPhase.updatePairs(this.addPair);
}

/**
 * @private
 *
 * @param {FixtureProxy} proxyA
 * @param {FixtureProxy} proxyB
 */
World.prototype.createContact = function(proxyA, proxyB) {
  var fixtureA = proxyA.fixture;
  var fixtureB = proxyB.fixture;

  var indexA = proxyA.childIndex;
  var indexB = proxyB.childIndex;

  var bodyA = fixtureA.getBody();
  var bodyB = fixtureB.getBody();

  // Are the fixtures on the same body?
  if (bodyA == bodyB) {
    return;
  }

  // TODO_ERIN use a hash table to remove a potential bottleneck when both
  // bodies have a lot of contacts.
  // Does a contact already exist?
  var edge = bodyB.getContactList(); // ContactEdge
  while (edge) {
    if (edge.other == bodyA) {
      var fA = edge.contact.getFixtureA();
      var fB = edge.contact.getFixtureB();
      var iA = edge.contact.getChildIndexA();
      var iB = edge.contact.getChildIndexB();

      if (fA == fixtureA && fB == fixtureB && iA == indexA && iB == indexB) {
        // A contact already exists.
        return;
      }

      if (fA == fixtureB && fB == fixtureA && iA == indexB && iB == indexA) {
        // A contact already exists.
        return;
      }
    }

    edge = edge.next;
  }

  if (bodyB.shouldCollide(bodyA) == false) {
    return;
  }
  if (fixtureB.shouldCollide(fixtureA) == false) {
    return;
  }

  // Call the factory.
  var contact = Contact.create(fixtureA, indexA, fixtureB, indexB);
  if (contact == null) {
    return;
  }

  // Insert into the world.
  contact.m_prev = null;
  if (this.m_contactList != null) {
    contact.m_next = this.m_contactList;
    this.m_contactList.m_prev = contact;
  }
  this.m_contactList = contact;

  ++this.m_contactCount;
}

/**
 * Removes old non-overlapping contacts, applies filters and updates contacts.
 */
World.prototype.updateContacts = function() {
  // Update awake contacts.
  var c, next_c = this.m_contactList;
  while (c = next_c) {
    next_c = c.getNext()
    var fixtureA = c.getFixtureA();
    var fixtureB = c.getFixtureB();
    var indexA = c.getChildIndexA();
    var indexB = c.getChildIndexB();
    var bodyA = fixtureA.getBody();
    var bodyB = fixtureB.getBody();

    // Is this contact flagged for filtering?
    if (c.m_filterFlag) {
      if (bodyB.shouldCollide(bodyA) == false) {
        this.destroyContact(c);
        continue;
      }

      if (fixtureB.shouldCollide(fixtureA) == false) {
        this.destroyContact(c);
        continue;
      }

      // Clear the filtering flag.
      c.m_filterFlag = false;
    }

    var activeA = bodyA.isAwake() && !bodyA.isStatic();
    var activeB = bodyB.isAwake() && !bodyB.isStatic();

    // At least one body must be awake and it must be dynamic or kinematic.
    if (activeA == false && activeB == false) {
      continue;
    }

    var proxyIdA = fixtureA.m_proxies[indexA].proxyId;
    var proxyIdB = fixtureB.m_proxies[indexB].proxyId;
    var overlap = this.m_broadPhase.testOverlap(proxyIdA, proxyIdB);

    // Here we destroy contacts that cease to overlap in the broad-phase.
    if (overlap == false) {
      this.destroyContact(c);
      continue;
    }

    // The contact persists.
    c.update(this);
  }
}

/**
 * @param {Contact} contact
 */
World.prototype.destroyContact = function(contact) {
  Contact.destroy(contact, this);

  // Remove from the world.
  if (contact.m_prev) {
    contact.m_prev.m_next = contact.m_next;
  }
  if (contact.m_next) {
    contact.m_next.m_prev = contact.m_prev;
  }
  if (contact == this.m_contactList) {
    this.m_contactList = contact.m_next;
  }

  --this.m_contactCount;
}

World.prototype._listeners = null;

/**
 * Register an event listener.
 *
 * @param {string} name
 * @param {function} listener
 */
World.prototype.on = function(name, listener) {
  if (typeof name !== 'string' || typeof listener !== 'function') {
    return this;
  }
  if (!this._listeners) {
    this._listeners = {};
  }
  if (!this._listeners[name]) {
    this._listeners[name] = [];
  }
  this._listeners[name].push(listener);
  return this;
};

/**
 * Remove an event listener.
 *
 * @param {string} name
 * @param {function} listener
 */
World.prototype.off = function(name, listener) {
  if (typeof name !== 'string' || typeof listener !== 'function') {
    return this;
  }
  var listeners = this._listeners && this._listeners[name];
  if (!listeners || !listeners.length) {
    return this;
  }
  var index = listeners.indexOf(listener);
  if (index >= 0) {
    listeners.splice(index, 1);
  }
  return this;
};

World.prototype.publish = function(name, arg1, arg2, arg3) {
  var listeners = this._listeners && this._listeners[name];
  if (!listeners || !listeners.length) {
    return 0;
  }
  for (var l = 0; l < listeners.length; l++) {
    listeners[l].call(this, arg1, arg2, arg3);
  }
  return listeners.length;
};

/**
 * @event World#remove-body
 * @event World#remove-joint
 * @event World#remove-fixture
 *
 * Joints and fixtures are destroyed when their associated body is destroyed.
 * Register a destruction listener so that you may nullify references to these
 * joints and shapes.
 *
 * `function(object)` is called when any joint or fixture is about to
 * be destroyed due to the destruction of one of its attached or parent bodies.
 */

/**
 * @private
 * @param {Contact} contact
 */
World.prototype.beginContact = function(contact) {
  this.publish('begin-contact', contact);
};

/**
 * @event World#begin-contact
 *
 * Called when two fixtures begin to touch.
 *
 * Implement contact callbacks to get contact information. You can use these
 * results for things like sounds and game logic. You can also get contact
 * results by traversing the contact lists after the time step. However, you
 * might miss some contacts because continuous physics leads to sub-stepping.
 * Additionally you may receive multiple callbacks for the same contact in a
 * single time step. You should strive to make your callbacks efficient because
 * there may be many callbacks per time step.
 *
 * Warning: You cannot create/destroy world entities inside these callbacks.
 */

/**
 * @private
 * @param {Contact} contact
 */
World.prototype.endContact = function(contact) {
  this.publish('end-contact', contact);
};

/**
 * @event World#end-contact
 *
 * Called when two fixtures cease to touch.
 *
 * Implement contact callbacks to get contact information. You can use these
 * results for things like sounds and game logic. You can also get contact
 * results by traversing the contact lists after the time step. However, you
 * might miss some contacts because continuous physics leads to sub-stepping.
 * Additionally you may receive multiple callbacks for the same contact in a
 * single time step. You should strive to make your callbacks efficient because
 * there may be many callbacks per time step.
 *
 * Warning: You cannot create/destroy world entities inside these callbacks.
 */

/**
 * @private
 * @param {Contact} contact
 * @param {Manifold} oldManifold
 */
World.prototype.preSolve = function(contact, oldManifold) {
  this.publish('pre-solve', contact, oldManifold);
};

/**
 * @event World#pre-solve
 *
 * This is called after a contact is updated. This allows you to inspect a
 * contact before it goes to the solver. If you are careful, you can modify the
 * contact manifold (e.g. disable contact). A copy of the old manifold is
 * provided so that you can detect changes. Note: this is called only for awake
 * bodies. Note: this is called even when the number of contact points is zero.
 * Note: this is not called for sensors. Note: if you set the number of contact
 * points to zero, you will not get an endContact callback. However, you may get
 * a beginContact callback the next step.
 *
 * Warning: You cannot create/destroy world entities inside these callbacks.
 */

/**
 * @private
 * @param {Contact} contact
 * @param {ContactImpulse} impulse
 */
World.prototype.postSolve = function(contact, impulse) {
  this.publish('post-solve', contact, impulse);
};

/**
 * @event World#post-solve
 *
 * This lets you inspect a contact after the solver is finished. This is useful
 * for inspecting impulses. Note: the contact manifold does not include time of
 * impact impulses, which can be arbitrarily large if the sub-step is small.
 * Hence the impulse is provided explicitly in a separate data structure. Note:
 * this is only called for contacts that are touching, solid, and awake.
 *
 * Warning: You cannot create/destroy world entities inside these callbacks.
 */

/**
 * Register a contact filter to provide specific control over collision.
 * Otherwise the default filter is used (defaultFilter). The listener is owned
 * by you and must remain in scope.
 *
 * Moved to Fixture.
 */


/***/ }),

/***/ "../../node_modules/planck-js/lib/collision/AABB.js":
/*!**********************************************************!*\
  !*** ../../node_modules/planck-js/lib/collision/AABB.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");

module.exports = AABB;

function AABB(lower, upper) {
  if (!(this instanceof AABB)) {
    return new AABB(lower, upper);
  }

  this.lowerBound = Vec2.zero();
  this.upperBound = Vec2.zero();

  if (typeof lower === 'object') {
    this.lowerBound.set(lower);
  }
  if (typeof upper === 'object') {
    this.upperBound.set(upper);
  } else if (typeof lower === 'object') {
    this.upperBound.set(lower);
  }
};

/**
 * Verify that the bounds are sorted.
 */
AABB.prototype.isValid = function() {
  return AABB.isValid(this);
}

AABB.isValid = function(aabb) {
  var d = Vec2.sub(aabb.upperBound, aabb.lowerBound);
  var valid = d.x >= 0.0 && d.y >= 0.0 && Vec2.isValid(aabb.lowerBound) && Vec2.isValid(aabb.upperBound);
  return valid;
}

AABB.assert = function(o) {
  if (!_ASSERT) return;
  if (!AABB.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid AABB!');
  }
}

/**
 * Get the center of the AABB.
 */
AABB.prototype.getCenter = function() {
  return Vec2.neo((this.lowerBound.x + this.upperBound.x) * 0.5, (this.lowerBound.y + this.upperBound.y) * 0.5);
}

/**
 * Get the extents of the AABB (half-widths).
 */
AABB.prototype.getExtents = function() {
  return Vec2.neo((this.upperBound.x - this.lowerBound.x) * 0.5, (this.upperBound.y - this.lowerBound.y) * 0.5);
}

/**
 * Get the perimeter length.
 */
AABB.prototype.getPerimeter = function() {
  return 2.0 * (this.upperBound.x - this.lowerBound.x + this.upperBound.y - this.lowerBound.y);
}

/**
 * Combine one or two AABB into this one.
 */
AABB.prototype.combine = function(a, b) {
  b = b || this;

  var lowerA = a.lowerBound;
  var upperA = a.upperBound;
  var lowerB = b.lowerBound;
  var upperB = b.upperBound;

  var lowerX = Math.min(lowerA.x, lowerB.x);
  var lowerY = Math.min(lowerA.y, lowerB.y);
  var upperX = Math.max(upperB.x, upperA.x);
  var upperY = Math.max(upperB.y, upperA.y);

  this.lowerBound.set(lowerX, lowerY);
  this.upperBound.set(upperX, upperY);
}

AABB.prototype.combinePoints = function(a, b) {
  this.lowerBound.set(Math.min(a.x, b.x), Math.min(a.y, b.y));
  this.upperBound.set(Math.max(a.x, b.x), Math.max(a.y, b.y));
}

AABB.prototype.set = function(aabb) {
  this.lowerBound.set(aabb.lowerBound.x, aabb.lowerBound.y);
  this.upperBound.set(aabb.upperBound.x, aabb.upperBound.y);
}

AABB.prototype.contains = function(aabb) {
  var result = true;
  result = result && this.lowerBound.x <= aabb.lowerBound.x;
  result = result && this.lowerBound.y <= aabb.lowerBound.y;
  result = result && aabb.upperBound.x <= this.upperBound.x;
  result = result && aabb.upperBound.y <= this.upperBound.y;
  return result;
}

AABB.prototype.extend = function(value) {
  AABB.extend(this, value);
  return this;
}

AABB.extend = function(aabb, value) {
  aabb.lowerBound.x -= value;
  aabb.lowerBound.y -= value;
  aabb.upperBound.x += value;
  aabb.upperBound.y += value;
}

AABB.testOverlap = function(a, b) {
  var d1x = b.lowerBound.x - a.upperBound.x;
  var d2x = a.lowerBound.x - b.upperBound.x;

  var d1y = b.lowerBound.y - a.upperBound.y;
  var d2y = a.lowerBound.y - b.upperBound.y;

  if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
    return false;
  }
  return true;
}

AABB.areEqual = function(a, b) {
  return Vec2.areEqual(a.lowerBound, b.lowerBound) && Vec2.areEqual(a.upperBound, b.upperBound);
}

AABB.diff = function(a, b) {
  var wD = Math.max(0, Math.min(a.upperBound.x, b.upperBound.x) - Math.max(b.lowerBound.x, a.lowerBound.x))
  var hD = Math.max(0, Math.min(a.upperBound.y, b.upperBound.y) - Math.max(b.lowerBound.y, a.lowerBound.y));

  var wA = a.upperBound.x - a.lowerBound.x;
  var hA = a.upperBound.y - a.lowerBound.y;

  var wB = b.upperBound.x - b.lowerBound.x;
  var hB = b.upperBound.y - b.lowerBound.y;

  return wA * hA + wB * hB - wD * hD;
};

/**
 * @typedef RayCastInput
 *
 * Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
 *
 * @prop {Vec2} p1
 * @prop {Vec2} p2
 * @prop {number} maxFraction
 */

/**
 * @typedef RayCastInput
 *
 * Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and
 * p2 come from RayCastInput.
 *
 * @prop {Vec2} normal
 * @prop {number} fraction
 */

/**
 * @param {RayCastOutput} output
 * @param {RayCastInput} input
 * @returns {boolean}
 */
AABB.prototype.rayCast = function(output, input) {
  // From Real-time Collision Detection, p179.

  var tmin = -Infinity;
  var tmax = Infinity;

  var p = input.p1;
  var d = Vec2.sub(input.p2, input.p1);
  var absD = Vec2.abs(d);

  var normal = Vec2.zero();

  for (var f = 'x'; f !== null; f = (f === 'x' ? 'y' : null)) {
    if (absD.x < Math.EPSILON) {
      // Parallel.
      if (p[f] < this.lowerBound[f] || this.upperBound[f] < p[f]) {
        return false;
      }
    } else {
      var inv_d = 1.0 / d[f];
      var t1 = (this.lowerBound[f] - p[f]) * inv_d;
      var t2 = (this.upperBound[f] - p[f]) * inv_d;

      // Sign of the normal vector.
      var s = -1.0;

      if (t1 > t2) {
        var temp = t1;
        t1 = t2, t2 = temp;
        s = 1.0;
      }

      // Push the min up
      if (t1 > tmin) {
        normal.setZero();
        normal[f] = s;
        tmin = t1;
      }

      // Pull the max down
      tmax = Math.min(tmax, t2);

      if (tmin > tmax) {
        return false;
      }
    }
  }

  // Does the ray start inside the box?
  // Does the ray intersect beyond the max fraction?
  if (tmin < 0.0 || input.maxFraction < tmin) {
    return false;
  }

  // Intersection.
  output.fraction = tmin;
  output.normal = normal;
  return true;
}

AABB.prototype.toString = function() {
  return JSON.stringify(this);
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/collision/BroadPhase.js":
/*!****************************************************************!*\
  !*** ../../node_modules/planck-js/lib/collision/BroadPhase.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var AABB = __webpack_require__(/*! ./AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var DynamicTree = __webpack_require__(/*! ./DynamicTree */ "../../node_modules/planck-js/lib/collision/DynamicTree.js");

module.exports = BroadPhase;

/**
 * The broad-phase wraps and extends a dynamic-tree to keep track of moved
 * objects and query them on update.
 */
function BroadPhase() {
  this.m_tree = new DynamicTree();
  this.m_proxyCount = 0;
  this.m_moveBuffer = [];
  this.queryCallback = this.queryCallback.bind(this);
};

/**
 * Get user data from a proxy. Returns null if the id is invalid.
 */
BroadPhase.prototype.getUserData = function(proxyId) {
  return this.m_tree.getUserData(proxyId);
}

/**
 * Test overlap of fat AABBs.
 */
BroadPhase.prototype.testOverlap = function(proxyIdA, proxyIdB) {
  var aabbA = this.m_tree.getFatAABB(proxyIdA);
  var aabbB = this.m_tree.getFatAABB(proxyIdB);
  return AABB.testOverlap(aabbA, aabbB);
}

/**
 * Get the fat AABB for a proxy.
 */
BroadPhase.prototype.getFatAABB = function(proxyId) {
  return this.m_tree.getFatAABB(proxyId);
}

/**
 * Get the number of proxies.
 */
BroadPhase.prototype.getProxyCount = function() {
  return this.m_proxyCount;
}

/**
 * Get the height of the embedded tree.
 */
BroadPhase.prototype.getTreeHeight = function() {
  return this.m_tree.getHeight();
}

/**
 * Get the balance (integer) of the embedded tree.
 */
BroadPhase.prototype.getTreeBalance = function() {
  return this.m_tree.getMaxBalance();
}

/**
 * Get the quality metric of the embedded tree.
 */
BroadPhase.prototype.getTreeQuality = function() {
  return this.m_tree.getAreaRatio();
}

/**
 * Query an AABB for overlapping proxies. The callback class is called for each
 * proxy that overlaps the supplied AABB.
 */
BroadPhase.prototype.query = function(aabb, queryCallback) {
  this.m_tree.query(aabb, queryCallback);
}

/**
 * Ray-cast against the proxies in the tree. This relies on the callback to
 * perform a exact ray-cast in the case were the proxy contains a shape. The
 * callback also performs the any collision filtering. This has performance
 * roughly equal to k * log(n), where k is the number of collisions and n is the
 * number of proxies in the tree.
 * 
 * @param input The ray-cast input data. The ray extends from p1 to p1 +
 *          maxFraction * (p2 - p1).
 * @param rayCastCallback A function that is called for each proxy that is hit by
 *          the ray.
 */
BroadPhase.prototype.rayCast = function(input, rayCastCallback) {
  this.m_tree.rayCast(input, rayCastCallback);
}

/**
 * Shift the world origin. Useful for large worlds. The shift formula is:
 * position -= newOrigin
 * 
 * @param newOrigin The new origin with respect to the old origin
 */
BroadPhase.prototype.shiftOrigin = function(newOrigin) {
  this.m_tree.shiftOrigin(newOrigin);
}

/**
 * Create a proxy with an initial AABB. Pairs are not reported until UpdatePairs
 * is called.
 */
BroadPhase.prototype.createProxy = function(aabb, userData) {
  _ASSERT && common.assert(AABB.isValid(aabb));
  var proxyId = this.m_tree.createProxy(aabb, userData);
  this.m_proxyCount++;
  this.bufferMove(proxyId);
  return proxyId;
}

/**
 * Destroy a proxy. It is up to the client to remove any pairs.
 */
BroadPhase.prototype.destroyProxy = function(proxyId) {
  this.unbufferMove(proxyId);
  this.m_proxyCount--;
  this.m_tree.destroyProxy(proxyId);
}

/**
 * Call moveProxy as many times as you like, then when you are done call
 * UpdatePairs to finalized the proxy pairs (for your time step).
 */
BroadPhase.prototype.moveProxy = function(proxyId, aabb, displacement) {
  _ASSERT && common.assert(AABB.isValid(aabb));
  var changed = this.m_tree.moveProxy(proxyId, aabb, displacement);
  if (changed) {
    this.bufferMove(proxyId);
  }
}

/**
 * Call to trigger a re-processing of it's pairs on the next call to
 * UpdatePairs.
 */
BroadPhase.prototype.touchProxy = function(proxyId) {
  this.bufferMove(proxyId);
}

BroadPhase.prototype.bufferMove = function(proxyId) {
  this.m_moveBuffer.push(proxyId);
}

BroadPhase.prototype.unbufferMove = function(proxyId) {
  for (var i = 0; i < this.m_moveBuffer.length; ++i) {
    if (this.m_moveBuffer[i] == proxyId) {
      this.m_moveBuffer[i] = null;
    }
  }
}

/**
 * @function BroadPhase~addPair
 * @param {Object} userDataA
 * @param {Object} userDataB
 */

/**
 * Update the pairs. This results in pair callbacks. This can only add pairs.
 * 
 * @param {BroadPhase~AddPair} addPairCallback
 */
BroadPhase.prototype.updatePairs = function(addPairCallback) {
  _ASSERT && common.assert(typeof addPairCallback === 'function');
  this.m_callback = addPairCallback;

  // Perform tree queries for all moving proxies.
  while (this.m_moveBuffer.length > 0) {
    this.m_queryProxyId = this.m_moveBuffer.pop();
    if (this.m_queryProxyId === null) {
      continue;
    }

    // We have to query the tree with the fat AABB so that
    // we don't fail to create a pair that may touch later.
    var fatAABB = this.m_tree.getFatAABB(this.m_queryProxyId);

    // Query tree, create pairs and add them pair buffer.
    this.m_tree.query(fatAABB, this.queryCallback);
  }

  // Try to keep the tree balanced.
  // this.m_tree.rebalance(4);
}

BroadPhase.prototype.queryCallback = function(proxyId) {
  // A proxy cannot form a pair with itself.
  if (proxyId == this.m_queryProxyId) {
    return true;
  }

  var proxyIdA = Math.min(proxyId, this.m_queryProxyId);
  var proxyIdB = Math.max(proxyId, this.m_queryProxyId);

  // TODO: Skip any duplicate pairs.

  var userDataA = this.m_tree.getUserData(proxyIdA);
  var userDataB = this.m_tree.getUserData(proxyIdB);

  // Send the pairs back to the client.
  this.m_callback(userDataA, userDataB);

  return true;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/collision/Distance.js":
/*!**************************************************************!*\
  !*** ../../node_modules/planck-js/lib/collision/Distance.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Distance;

module.exports.Input = DistanceInput;
module.exports.Output = DistanceOutput;
module.exports.Proxy = DistanceProxy;
module.exports.Cache = SimplexCache;

var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");

var stats = __webpack_require__(/*! ../common/stats */ "../../node_modules/planck-js/lib/common/stats.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

/**
 * GJK using Voronoi regions (Christer Ericson) and Barycentric coordinates.
 */

stats.gjkCalls = 0;
stats.gjkIters = 0;
stats.gjkMaxIters = 0;

/**
 * Input for Distance. You have to option to use the shape radii in the
 * computation. Even
 */
function DistanceInput() {
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.transformA = null;
  this.transformB = null;
  this.useRadii = false;
};

/**
 * Output for Distance.
 *
 * @prop {Vec2} pointA closest point on shapeA
 * @prop {Vec2} pointB closest point on shapeB
 * @prop distance
 * @prop iterations number of GJK iterations used
 */
function DistanceOutput() {
  this.pointA = Vec2.zero();
  this.pointB = Vec2.zero();
  this.distance;
  this.iterations;
}

/**
 * Used to warm start Distance. Set count to zero on first call.
 *
 * @prop {number} metric length or area
 * @prop {array} indexA vertices on shape A
 * @prop {array} indexB vertices on shape B
 * @prop {number} count
 */
function SimplexCache() {
  this.metric = 0;
  this.indexA = [];
  this.indexB = [];
  this.count = 0;
};

/**
 * Compute the closest points between two shapes. Supports any combination of:
 * CircleShape, PolygonShape, EdgeShape. The simplex cache is input/output. On
 * the first call set SimplexCache.count to zero.
 *
 * @param {DistanceOutput} output
 * @param {SimplexCache} cache
 * @param {DistanceInput} input
 */
function Distance(output, cache, input) {
  ++stats.gjkCalls;

  var proxyA = input.proxyA;
  var proxyB = input.proxyB;
  var xfA = input.transformA;
  var xfB = input.transformB;

  // Initialize the simplex.
  var simplex = new Simplex();
  simplex.readCache(cache, proxyA, xfA, proxyB, xfB);

  // Get simplex vertices as an array.
  var vertices = simplex.m_v;// SimplexVertex
  var k_maxIters = Settings.maxDistnceIterations;

  // These store the vertices of the last simplex so that we
  // can check for duplicates and prevent cycling.
  var saveA = [];
  var saveB = []; // int[3]
  var saveCount = 0;

  var distanceSqr1 = Infinity;
  var distanceSqr2 = Infinity;

  // Main iteration loop.
  var iter = 0;
  while (iter < k_maxIters) {
    // Copy simplex so we can identify duplicates.
    saveCount = simplex.m_count;
    for (var i = 0; i < saveCount; ++i) {
      saveA[i] = vertices[i].indexA;
      saveB[i] = vertices[i].indexB;
    }

    simplex.solve();

    // If we have 3 points, then the origin is in the corresponding triangle.
    if (simplex.m_count == 3) {
      break;
    }

    // Compute closest point.
    var p = simplex.getClosestPoint();
    distanceSqr2 = p.lengthSquared();

    // Ensure progress
    if (distanceSqr2 >= distanceSqr1) {
      // break;
    }
    distanceSqr1 = distanceSqr2;

    // Get search direction.
    var d = simplex.getSearchDirection();

    // Ensure the search direction is numerically fit.
    if (d.lengthSquared() < Math.EPSILON * Math.EPSILON) {
      // The origin is probably contained by a line segment
      // or triangle. Thus the shapes are overlapped.

      // We can't return zero here even though there may be overlap.
      // In case the simplex is a point, segment, or triangle it is difficult
      // to determine if the origin is contained in the CSO or very close to it.
      break;
    }

    // Compute a tentative new simplex vertex using support points.
    var vertex = vertices[simplex.m_count]; // SimplexVertex

    vertex.indexA = proxyA.getSupport(Rot.mulTVec2(xfA.q, Vec2.neg(d)));
    vertex.wA = Transform.mulVec2(xfA, proxyA.getVertex(vertex.indexA));

    vertex.indexB = proxyB.getSupport(Rot.mulTVec2(xfB.q, d));
    vertex.wB = Transform.mulVec2(xfB, proxyB.getVertex(vertex.indexB));

    vertex.w = Vec2.sub(vertex.wB, vertex.wA);

    // Iteration count is equated to the number of support point calls.
    ++iter;
    ++stats.gjkIters;

    // Check for duplicate support points. This is the main termination
    // criteria.
    var duplicate = false;
    for (var i = 0; i < saveCount; ++i) {
      if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
        duplicate = true;
        break;
      }
    }

    // If we found a duplicate support point we must exit to avoid cycling.
    if (duplicate) {
      break;
    }

    // New vertex is ok and needed.
    ++simplex.m_count;
  }

  stats.gjkMaxIters = Math.max(stats.gjkMaxIters, iter);

  // Prepare output.
  simplex.getWitnessPoints(output.pointA, output.pointB);
  output.distance = Vec2.distance(output.pointA, output.pointB);
  output.iterations = iter;

  // Cache the simplex.
  simplex.writeCache(cache);

  // Apply radii if requested.
  if (input.useRadii) {
    var rA = proxyA.m_radius;
    var rB = proxyB.m_radius;

    if (output.distance > rA + rB && output.distance > Math.EPSILON) {
      // Shapes are still no overlapped.
      // Move the witness points to the outer surface.
      output.distance -= rA + rB;
      var normal = Vec2.sub(output.pointB, output.pointA);
      normal.normalize();
      output.pointA.addMul(rA, normal);
      output.pointB.subMul(rB, normal);
    } else {
      // Shapes are overlapped when radii are considered.
      // Move the witness points to the middle.
      var p = Vec2.mid(output.pointA, output.pointB);
      output.pointA.set(p);
      output.pointB.set(p);
      output.distance = 0.0;
    }
  }
}

/**
 * A distance proxy is used by the GJK algorithm. It encapsulates any shape.
 */
function DistanceProxy() {
  this.m_buffer = []; // Vec2[2]
  this.m_vertices = []; // Vec2[]
  this.m_count = 0;
  this.m_radius = 0;
};

/**
 * Get the vertex count.
 */
DistanceProxy.prototype.getVertexCount = function() {
  return this.m_count;
}

/**
 * Get a vertex by index. Used by Distance.
 */
DistanceProxy.prototype.getVertex = function(index) {
  _ASSERT && common.assert(0 <= index && index < this.m_count);
  return this.m_vertices[index];
}

/**
 * Get the supporting vertex index in the given direction.
 */
DistanceProxy.prototype.getSupport = function(d) {
  var bestIndex = 0;
  var bestValue = Vec2.dot(this.m_vertices[0], d);
  for (var i = 0; i < this.m_count; ++i) {
    var value = Vec2.dot(this.m_vertices[i], d);
    if (value > bestValue) {
      bestIndex = i;
      bestValue = value;
    }
  }
  return bestIndex;
}

/**
 * Get the supporting vertex in the given direction.
 */
DistanceProxy.prototype.getSupportVertex = function(d) {
  return this.m_vertices[this.getSupport(d)];
}

/**
 * Initialize the proxy using the given shape. The shape must remain in scope
 * while the proxy is in use.
 */
DistanceProxy.prototype.set = function(shape, index) {
  // TODO remove, use shape instead
  _ASSERT && common.assert(typeof shape.computeDistanceProxy === 'function');
  shape.computeDistanceProxy(this, index);
}

function SimplexVertex() {
  this.indexA; // wA index
  this.indexB; // wB index
  this.wA = Vec2.zero(); // support point in proxyA
  this.wB = Vec2.zero(); // support point in proxyB
  this.w = Vec2.zero(); // wB - wA
  this.a; // barycentric coordinate for closest point
};

SimplexVertex.prototype.set = function(v) {
  this.indexA = v.indexA;
  this.indexB = v.indexB;
  this.wA = Vec2.clone(v.wA);
  this.wB = Vec2.clone(v.wB);
  this.w = Vec2.clone(v.w);
  this.a = v.a;
};

function Simplex() {
  this.m_v1 = new SimplexVertex();
  this.m_v2 = new SimplexVertex();
  this.m_v3 = new SimplexVertex();
  this.m_v = [ this.m_v1, this.m_v2, this.m_v3 ];
  this.m_count;
};

Simplex.prototype.print = function() {
  if (this.m_count == 3) {
    return ["+" + this.m_count,
      this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y,
      this.m_v2.a, this.m_v2.wA.x, this.m_v2.wA.y, this.m_v2.wB.x, this.m_v2.wB.y,
      this.m_v3.a, this.m_v3.wA.x, this.m_v3.wA.y, this.m_v3.wB.x, this.m_v3.wB.y
    ].toString();

  } else if (this.m_count == 2) {
    return ["+" + this.m_count,
      this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y,
      this.m_v2.a, this.m_v2.wA.x, this.m_v2.wA.y, this.m_v2.wB.x, this.m_v2.wB.y
    ].toString();

  } else if (this.m_count == 1) {
    return ["+" + this.m_count,
      this.m_v1.a, this.m_v1.wA.x, this.m_v1.wA.y, this.m_v1.wB.x, this.m_v1.wB.y
    ].toString();

  } else {
    return "+" + this.m_count;
  }
};

// (SimplexCache, DistanceProxy, ...)
Simplex.prototype.readCache = function(cache, proxyA, transformA, proxyB, transformB) {
  _ASSERT && common.assert(cache.count <= 3);

  // Copy data from cache.
  this.m_count = cache.count;
  for (var i = 0; i < this.m_count; ++i) {
    var v = this.m_v[i];
    v.indexA = cache.indexA[i];
    v.indexB = cache.indexB[i];
    var wALocal = proxyA.getVertex(v.indexA);
    var wBLocal = proxyB.getVertex(v.indexB);
    v.wA = Transform.mulVec2(transformA, wALocal);
    v.wB = Transform.mulVec2(transformB, wBLocal);
    v.w = Vec2.sub(v.wB, v.wA);
    v.a = 0.0;
  }

  // Compute the new simplex metric, if it is substantially different than
  // old metric then flush the simplex.
  if (this.m_count > 1) {
    var metric1 = cache.metric;
    var metric2 = this.getMetric();
    if (metric2 < 0.5 * metric1 || 2.0 * metric1 < metric2
        || metric2 < Math.EPSILON) {
      // Reset the simplex.
      this.m_count = 0;
    }
  }

  // If the cache is empty or invalid...
  if (this.m_count == 0) {
    var v = this.m_v[0];// SimplexVertex
    v.indexA = 0;
    v.indexB = 0;
    var wALocal = proxyA.getVertex(0);
    var wBLocal = proxyB.getVertex(0);
    v.wA = Transform.mulVec2(transformA, wALocal);
    v.wB = Transform.mulVec2(transformB, wBLocal);
    v.w = Vec2.sub(v.wB, v.wA);
    v.a = 1.0;
    this.m_count = 1;
  }
}

// (SimplexCache)
Simplex.prototype.writeCache = function(cache) {
  cache.metric = this.getMetric();
  cache.count = this.m_count;
  for (var i = 0; i < this.m_count; ++i) {
    cache.indexA[i] = this.m_v[i].indexA;
    cache.indexB[i] = this.m_v[i].indexB;
  }
}

Simplex.prototype.getSearchDirection = function() {
  switch (this.m_count) {
  case 1:
    return Vec2.neg(this.m_v1.w);

  case 2: {
    var e12 = Vec2.sub(this.m_v2.w, this.m_v1.w);
    var sgn = Vec2.cross(e12, Vec2.neg(this.m_v1.w));
    if (sgn > 0.0) {
      // Origin is left of e12.
      return Vec2.cross(1.0, e12);
    } else {
      // Origin is right of e12.
      return Vec2.cross(e12, 1.0);
    }
  }

  default:
    _ASSERT && common.assert(false);
    return Vec2.zero();
  }
}

Simplex.prototype.getClosestPoint = function() {
  switch (this.m_count) {
  case 0:
    _ASSERT && common.assert(false);
    return Vec2.zero();

  case 1:
    return Vec2.clone(this.m_v1.w);

  case 2:
    return Vec2.combine(this.m_v1.a, this.m_v1.w, this.m_v2.a, this.m_v2.w);

  case 3:
    return Vec2.zero();

  default:
    _ASSERT && common.assert(false);
    return Vec2.zero();
  }
}

Simplex.prototype.getWitnessPoints = function(pA, pB) {
  switch (this.m_count) {
  case 0:
    _ASSERT && common.assert(false);
    break;

  case 1:
    pA.set(this.m_v1.wA);
    pB.set(this.m_v1.wB);
    break;

  case 2:
    pA.setCombine(this.m_v1.a, this.m_v1.wA, this.m_v2.a, this.m_v2.wA);
    pB.setCombine(this.m_v1.a, this.m_v1.wB, this.m_v2.a, this.m_v2.wB);
    break;

  case 3:
    pA.setCombine(this.m_v1.a, this.m_v1.wA, this.m_v2.a, this.m_v2.wA);
    pA.addMul(this.m_v3.a, this.m_v3.wA);
    pB.set(pA);
    break;

  default:
    _ASSERT && common.assert(false);
    break;
  }
}

Simplex.prototype.getMetric = function() {
  switch (this.m_count) {
  case 0:
    _ASSERT && common.assert(false);
    return 0.0;

  case 1:
    return 0.0;

  case 2:
    return Vec2.distance(this.m_v1.w, this.m_v2.w);

  case 3:
    return Vec2.cross(Vec2.sub(this.m_v2.w, this.m_v1.w), Vec2.sub(this.m_v3.w,
        this.m_v1.w));

  default:
    _ASSERT && common.assert(false);
    return 0.0;
  }
}

Simplex.prototype.solve = function() {
  switch (this.m_count) {
  case 1:
    break;

  case 2:
    this.solve2();
    break;

  case 3:
    this.solve3();
    break;

  default:
    _ASSERT && common.assert(false);
  }
}

// Solve a line segment using barycentric coordinates.
//
// p = a1 * w1 + a2 * w2
// a1 + a2 = 1
//
// The vector from the origin to the closest point on the line is
// perpendicular to the line.
// e12 = w2 - w1
// dot(p, e) = 0
// a1 * dot(w1, e) + a2 * dot(w2, e) = 0
//
// 2-by-2 linear system
// [1 1 ][a1] = [1]
// [w1.e12 w2.e12][a2] = [0]
//
// Define
// d12_1 = dot(w2, e12)
// d12_2 = -dot(w1, e12)
// d12 = d12_1 + d12_2
//
// Solution
// a1 = d12_1 / d12
// a2 = d12_2 / d12
Simplex.prototype.solve2 = function() {
  var w1 = this.m_v1.w;
  var w2 = this.m_v2.w;
  var e12 = Vec2.sub(w2, w1);

  // w1 region
  var d12_2 = -Vec2.dot(w1, e12);
  if (d12_2 <= 0.0) {
    // a2 <= 0, so we clamp it to 0
    this.m_v1.a = 1.0;
    this.m_count = 1;
    return;
  }

  // w2 region
  var d12_1 = Vec2.dot(w2, e12);
  if (d12_1 <= 0.0) {
    // a1 <= 0, so we clamp it to 0
    this.m_v2.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v2);
    return;
  }

  // Must be in e12 region.
  var inv_d12 = 1.0 / (d12_1 + d12_2);
  this.m_v1.a = d12_1 * inv_d12;
  this.m_v2.a = d12_2 * inv_d12;
  this.m_count = 2;
}

// Possible regions:
// - points[2]
// - edge points[0]-points[2]
// - edge points[1]-points[2]
// - inside the triangle
Simplex.prototype.solve3 = function() {
  var w1 = this.m_v1.w;
  var w2 = this.m_v2.w;
  var w3 = this.m_v3.w;

  // Edge12
  // [1 1 ][a1] = [1]
  // [w1.e12 w2.e12][a2] = [0]
  // a3 = 0
  var e12 = Vec2.sub(w2, w1);
  var w1e12 = Vec2.dot(w1, e12);
  var w2e12 = Vec2.dot(w2, e12);
  var d12_1 = w2e12;
  var d12_2 = -w1e12;

  // Edge13
  // [1 1 ][a1] = [1]
  // [w1.e13 w3.e13][a3] = [0]
  // a2 = 0
  var e13 = Vec2.sub(w3, w1);
  var w1e13 = Vec2.dot(w1, e13);
  var w3e13 = Vec2.dot(w3, e13);
  var d13_1 = w3e13;
  var d13_2 = -w1e13;

  // Edge23
  // [1 1 ][a2] = [1]
  // [w2.e23 w3.e23][a3] = [0]
  // a1 = 0
  var e23 = Vec2.sub(w3, w2);// Vec2
  var w2e23 = Vec2.dot(w2, e23);
  var w3e23 = Vec2.dot(w3, e23);
  var d23_1 = w3e23;
  var d23_2 = -w2e23;

  // Triangle123
  var n123 = Vec2.cross(e12, e13);

  var d123_1 = n123 * Vec2.cross(w2, w3);
  var d123_2 = n123 * Vec2.cross(w3, w1);
  var d123_3 = n123 * Vec2.cross(w1, w2);

  // w1 region
  if (d12_2 <= 0.0 && d13_2 <= 0.0) {
    this.m_v1.a = 1.0;
    this.m_count = 1;
    return;
  }

  // e12
  if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
    var inv_d12 = 1.0 / (d12_1 + d12_2);
    this.m_v1.a = d12_1 * inv_d12;
    this.m_v2.a = d12_2 * inv_d12;
    this.m_count = 2;
    return;
  }

  // e13
  if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
    var inv_d13 = 1.0 / (d13_1 + d13_2);
    this.m_v1.a = d13_1 * inv_d13;
    this.m_v3.a = d13_2 * inv_d13;
    this.m_count = 2;
    this.m_v2.set(this.m_v3);
    return;
  }

  // w2 region
  if (d12_1 <= 0.0 && d23_2 <= 0.0) {
    this.m_v2.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v2);
    return;
  }

  // w3 region
  if (d13_1 <= 0.0 && d23_1 <= 0.0) {
    this.m_v3.a = 1.0;
    this.m_count = 1;
    this.m_v1.set(this.m_v3);
    return;
  }

  // e23
  if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
    var inv_d23 = 1.0 / (d23_1 + d23_2);
    this.m_v2.a = d23_1 * inv_d23;
    this.m_v3.a = d23_2 * inv_d23;
    this.m_count = 2;
    this.m_v1.set(this.m_v3);
    return;
  }

  // Must be in triangle123
  var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
  this.m_v1.a = d123_1 * inv_d123;
  this.m_v2.a = d123_2 * inv_d123;
  this.m_v3.a = d123_3 * inv_d123;
  this.m_count = 3;
}

/**
 * Determine if two generic shapes overlap.
 */
Distance.testOverlap = function(shapeA, indexA, shapeB, indexB, xfA, xfB) {
  var input = new DistanceInput();
  input.proxyA.set(shapeA, indexA);
  input.proxyB.set(shapeB, indexB);
  input.transformA = xfA;
  input.transformB = xfB;
  input.useRadii = true;

  var cache = new SimplexCache();

  var output = new DistanceOutput();
  Distance(output, cache, input);

  return output.distance < 10.0 * Math.EPSILON;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/collision/DynamicTree.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/planck-js/lib/collision/DynamicTree.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Pool = __webpack_require__(/*! ../util/Pool */ "../../node_modules/planck-js/lib/util/Pool.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var AABB = __webpack_require__(/*! ./AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");

module.exports = DynamicTree;

/**
 * A node in the dynamic tree. The client does not interact with this directly.
 * 
 * @prop {AABB} aabb Enlarged AABB
 * @prop {integer} height 0: leaf, -1: free node
 */
function TreeNode(id) {
  this.id = id;
  this.aabb = new AABB();
  this.userData = null;
  this.parent = null;
  this.child1 = null;
  this.child2 = null;
  this.height = -1;

  this.toString = function() {
    return this.id + ": " + this.userData;
  }
};

TreeNode.prototype.isLeaf = function() {
  return this.child1 == null;
}
/**
 * A dynamic AABB tree broad-phase, inspired by Nathanael Presson's btDbvt. A
 * dynamic tree arranges data in a binary tree to accelerate queries such as
 * volume queries and ray casts. Leafs are proxies with an AABB. In the tree we
 * expand the proxy AABB by `aabbExtension` so that the proxy AABB is bigger
 * than the client object. This allows the client object to move by small
 * amounts without triggering a tree update.
 * 
 * Nodes are pooled and relocatable, so we use node indices rather than
 * pointers.
 */
function DynamicTree() {
  this.m_root = null;
  this.m_nodes = {}
  this.m_lastProxyId = 0;

  this.m_pool = new Pool({
    create : function() {
      return new TreeNode();
    }
  });
};

/**
 * Get proxy user data.
 * 
 * @return the proxy user data or 0 if the id is invalid.
 */
DynamicTree.prototype.getUserData = function(id) {
  var node = this.m_nodes[id];
  _ASSERT && common.assert(!!node);
  return node.userData;
}

/**
 * Get the fat AABB for a node id.
 * 
 * @return the proxy user data or 0 if the id is invalid.
 */
DynamicTree.prototype.getFatAABB = function(id) {
  var node = this.m_nodes[id];
  _ASSERT && common.assert(!!node);
  return node.aabb;
}

DynamicTree.prototype.allocateNode = function() {
  var node = this.m_pool.allocate();
  node.id = ++this.m_lastProxyId;
  node.userData = null;
  node.parent = null;
  node.child1 = null;
  node.child2 = null;
  node.height = -1;
  this.m_nodes[node.id] = node;
  return node;
}

DynamicTree.prototype.freeNode = function(node) {
  this.m_pool.release(node);
  node.height = -1;
  delete this.m_nodes[node.id];
}

/**
 * Create a proxy in the tree as a leaf node. We return the index of the node
 * instead of a pointer so that we can grow the node pool.
 * 
 * Create a proxy. Provide a tight fitting AABB and a userData pointer.
 */
DynamicTree.prototype.createProxy = function(aabb, userData) {
  _ASSERT && common.assert(AABB.isValid(aabb))

  var node = this.allocateNode()

  node.aabb.set(aabb);

  // Fatten the aabb.
  AABB.extend(node.aabb, Settings.aabbExtension);

  node.userData = userData;
  node.height = 0;

  this.insertLeaf(node);

  return node.id;
}

/**
 * Destroy a proxy. This asserts if the id is invalid.
 */
DynamicTree.prototype.destroyProxy = function(id) {
  var node = this.m_nodes[id];

  _ASSERT && common.assert(!!node);
  _ASSERT && common.assert(node.isLeaf());

  this.removeLeaf(node);
  this.freeNode(node);
}

/**
 * Move a proxy with a swepted AABB. If the proxy has moved outside of its
 * fattened AABB, then the proxy is removed from the tree and re-inserted.
 * Otherwise the function returns immediately.
 * 
 * @param id
 * @param aabb
 * @param {Vec2} d Displacement
 * 
 * @return true if the proxy was re-inserted.
 */
DynamicTree.prototype.moveProxy = function(id, aabb, d) {
  _ASSERT && common.assert(AABB.isValid(aabb));
  _ASSERT && common.assert(!d || Vec2.isValid(d));

  var node = this.m_nodes[id];

  _ASSERT && common.assert(!!node);
  _ASSERT && common.assert(node.isLeaf());

  if (node.aabb.contains(aabb)) {
    return false;
  }

  this.removeLeaf(node);

  node.aabb.set(aabb)

  // Extend AABB.
  aabb = node.aabb;
  AABB.extend(aabb, Settings.aabbExtension);

  // Predict AABB displacement.
  // var d = Vec2.mul(Settings.aabbMultiplier, displacement);

  if (d.x < 0.0) {
    aabb.lowerBound.x += d.x * Settings.aabbMultiplier;
  } else {
    aabb.upperBound.x += d.x * Settings.aabbMultiplier;
  }

  if (d.y < 0.0) {
    aabb.lowerBound.y += d.y * Settings.aabbMultiplier;
  } else {
    aabb.upperBound.y += d.y * Settings.aabbMultiplier;
  }

  this.insertLeaf(node);

  return true;
}

DynamicTree.prototype.insertLeaf = function(leaf) {
  _ASSERT && common.assert(AABB.isValid(leaf.aabb));

  if (this.m_root == null) {
    this.m_root = leaf;
    this.m_root.parent = null;
    return;
  }

  // Find the best sibling for this node
  var leafAABB = leaf.aabb;
  var index = this.m_root;
  while (index.isLeaf() == false) {
    var child1 = index.child1;
    var child2 = index.child2;

    var area = index.aabb.getPerimeter();

    var combinedAABB = new AABB();
    combinedAABB.combine(index.aabb, leafAABB);
    var combinedArea = combinedAABB.getPerimeter();

    // Cost of creating a new parent for this node and the new leaf
    var cost = 2.0 * combinedArea;

    // Minimum cost of pushing the leaf further down the tree
    var inheritanceCost = 2.0 * (combinedArea - area);

    // Cost of descending into child1
    var cost1;
    if (child1.isLeaf()) {
      var aabb = new AABB();
      aabb.combine(leafAABB, child1.aabb);
      cost1 = aabb.getPerimeter() + inheritanceCost;
    } else {
      var aabb = new AABB();
      aabb.combine(leafAABB, child1.aabb);
      var oldArea = child1.aabb.getPerimeter();
      var newArea = aabb.getPerimeter();
      cost1 = (newArea - oldArea) + inheritanceCost;
    }

    // Cost of descending into child2
    var cost2;
    if (child2.isLeaf()) {
      var aabb = new AABB();
      aabb.combine(leafAABB, child2.aabb);
      cost2 = aabb.getPerimeter() + inheritanceCost;
    } else {
      var aabb = new AABB();
      aabb.combine(leafAABB, child2.aabb);
      var oldArea = child2.aabb.getPerimeter();
      var newArea = aabb.getPerimeter();
      cost2 = newArea - oldArea + inheritanceCost;
    }

    // Descend according to the minimum cost.
    if (cost < cost1 && cost < cost2) {
      break;
    }

    // Descend
    if (cost1 < cost2) {
      index = child1;
    } else {
      index = child2;
    }
  }

  var sibling = index;

  // Create a new parent.
  var oldParent = sibling.parent;
  var newParent = this.allocateNode();
  newParent.parent = oldParent;
  newParent.userData = null;
  newParent.aabb.combine(leafAABB, sibling.aabb);
  newParent.height = sibling.height + 1;

  if (oldParent != null) {
    // The sibling was not the root.
    if (oldParent.child1 == sibling) {
      oldParent.child1 = newParent;
    } else {
      oldParent.child2 = newParent;
    }

    newParent.child1 = sibling;
    newParent.child2 = leaf;
    sibling.parent = newParent;
    leaf.parent = newParent;
  } else {
    // The sibling was the root.
    newParent.child1 = sibling;
    newParent.child2 = leaf;
    sibling.parent = newParent;
    leaf.parent = newParent;
    this.m_root = newParent;
  }

  // Walk back up the tree fixing heights and AABBs
  index = leaf.parent;
  while (index != null) {
    index = this.balance(index);

    var child1 = index.child1;
    var child2 = index.child2;

    _ASSERT && common.assert(child1 != null);
    _ASSERT && common.assert(child2 != null);

    index.height = 1 + Math.max(child1.height, child2.height);
    index.aabb.combine(child1.aabb, child2.aabb);

    index = index.parent;
  }

  // validate();
}

DynamicTree.prototype.removeLeaf = function(leaf) {
  if (leaf == this.m_root) {
    this.m_root = null;
    return;
  }

  var parent = leaf.parent;
  var grandParent = parent.parent;
  var sibling;
  if (parent.child1 == leaf) {
    sibling = parent.child2;
  } else {
    sibling = parent.child1;
  }

  if (grandParent != null) {
    // Destroy parent and connect sibling to grandParent.
    if (grandParent.child1 == parent) {
      grandParent.child1 = sibling;
    } else {
      grandParent.child2 = sibling;
    }
    sibling.parent = grandParent;
    this.freeNode(parent);

    // Adjust ancestor bounds.
    var index = grandParent;
    while (index != null) {
      index = this.balance(index);

      var child1 = index.child1;
      var child2 = index.child2;

      index.aabb.combine(child1.aabb, child2.aabb);
      index.height = 1 + Math.max(child1.height, child2.height);

      index = index.parent;
    }
  } else {
    this.m_root = sibling;
    sibling.parent = null;
    this.freeNode(parent);
  }

  // validate();
}

/**
 * Perform a left or right rotation if node A is imbalanced. Returns the new
 * root index.
 */
DynamicTree.prototype.balance = function(iA) {
  _ASSERT && common.assert(iA != null);

  var A = iA;
  if (A.isLeaf() || A.height < 2) {
    return iA;
  }

  var B = A.child1;
  var C = A.child2;

  var balance = C.height - B.height;

  // Rotate C up
  if (balance > 1) {
    var F = C.child1;
    var G = C.child2;

    // Swap A and C
    C.child1 = A;
    C.parent = A.parent;
    A.parent = C;

    // A's old parent should point to C
    if (C.parent != null) {
      if (C.parent.child1 == iA) {
        C.parent.child1 = C;
      } else {
        C.parent.child2 = C;
      }
    } else {
      this.m_root = C;
    }

    // Rotate
    if (F.height > G.height) {
      C.child2 = F;
      A.child2 = G;
      G.parent = A;
      A.aabb.combine(B.aabb, G.aabb);
      C.aabb.combine(A.aabb, F.aabb);

      A.height = 1 + Math.max(B.height, G.height);
      C.height = 1 + Math.max(A.height, F.height);
    } else {
      C.child2 = G;
      A.child2 = F;
      F.parent = A;
      A.aabb.combine(B.aabb, F.aabb);
      C.aabb.combine(A.aabb, G.aabb);

      A.height = 1 + Math.max(B.height, F.height);
      C.height = 1 + Math.max(A.height, G.height);
    }

    return C;
  }

  // Rotate B up
  if (balance < -1) {
    var D = B.child1;
    var E = B.child2;

    // Swap A and B
    B.child1 = A;
    B.parent = A.parent;
    A.parent = B;

    // A's old parent should point to B
    if (B.parent != null) {
      if (B.parent.child1 == A) {
        B.parent.child1 = B;
      } else {
        B.parent.child2 = B;
      }
    } else {
      this.m_root = B;
    }

    // Rotate
    if (D.height > E.height) {
      B.child2 = D;
      A.child1 = E;
      E.parent = A;
      A.aabb.combine(C.aabb, E.aabb);
      B.aabb.combine(A.aabb, D.aabb);

      A.height = 1 + Math.max(C.height, E.height);
      B.height = 1 + Math.max(A.height, D.height);
    } else {
      B.child2 = E;
      A.child1 = D;
      D.parent = A;
      A.aabb.combine(C.aabb, D.aabb);
      B.aabb.combine(A.aabb, E.aabb);

      A.height = 1 + Math.max(C.height, D.height);
      B.height = 1 + Math.max(A.height, E.height);
    }

    return B;
  }

  return A;
}

/**
 * Compute the height of the binary tree in O(N) time. Should not be called
 * often.
 */
DynamicTree.prototype.getHeight = function() {
  if (this.m_root == null) {
    return 0;
  }

  return this.m_root.height;
}

/**
 * Get the ratio of the sum of the node areas to the root area.
 */
DynamicTree.prototype.getAreaRatio = function() {
  if (this.m_root == null) {
    return 0.0;
  }

  var root = this.m_root;
  var rootArea = root.aabb.getPerimeter();

  var totalArea = 0.0;
  var node, it = iteratorPool.allocate().preorder(this.m_root);
  while (node = it.next()) {
    if (node.height < 0) {
      // Free node in pool
      continue;
    }

    totalArea += node.aabb.getPerimeter();
  }

  iteratorPool.release(it);

  return totalArea / rootArea;
}

/**
 * Compute the height of a sub-tree.
 */
DynamicTree.prototype.computeHeight = function(id) {
  var node;
  if (typeof id !== 'undefined') {
    node = this.m_nodes[id];
  } else {
    node = this.m_root;
  }

  // _ASSERT && common.assert(0 <= id && id < this.m_nodeCapacity);

  if (node.isLeaf()) {
    return 0;
  }

  var height1 = this.computeHeight(node.child1.id);
  var height2 = this.computeHeight(node.child2.id);
  return 1 + Math.max(height1, height2);
}

DynamicTree.prototype.validateStructure = function(node) {
  if (node == null) {
    return;
  }

  if (node == this.m_root) {
    _ASSERT && common.assert(node.parent == null);
  }

  var child1 = node.child1;
  var child2 = node.child2;

  if (node.isLeaf()) {
    _ASSERT && common.assert(child1 == null);
    _ASSERT && common.assert(child2 == null);
    _ASSERT && common.assert(node.height == 0);
    return;
  }

  // _ASSERT && common.assert(0 <= child1 && child1 < this.m_nodeCapacity);
  // _ASSERT && common.assert(0 <= child2 && child2 < this.m_nodeCapacity);

  _ASSERT && common.assert(child1.parent == node);
  _ASSERT && common.assert(child2.parent == node);

  this.validateStructure(child1);
  this.validateStructure(child2);
}

DynamicTree.prototype.validateMetrics = function(node) {
  if (node == null) {
    return;
  }

  var child1 = node.child1;
  var child2 = node.child2;

  if (node.isLeaf()) {
    _ASSERT && common.assert(child1 == null);
    _ASSERT && common.assert(child2 == null);
    _ASSERT && common.assert(node.height == 0);
    return;
  }

  // _ASSERT && common.assert(0 <= child1 && child1 < this.m_nodeCapacity);
  // _ASSERT && common.assert(0 <= child2 && child2 < this.m_nodeCapacity);

  var height1 = child1.height;
  var height2 = child2.height;
  var height = 1 + Math.max(height1, height2);
  _ASSERT && common.assert(node.height == height);

  var aabb = new AABB();
  aabb.combine(child1.aabb, child2.aabb);

  _ASSERT && common.assert(AABB.areEqual(aabb, node.aabb));

  this.validateMetrics(child1);
  this.validateMetrics(child2);
}

// Validate this tree. For testing.
DynamicTree.prototype.validate = function() {
  this.validateStructure(this.m_root);
  this.validateMetrics(this.m_root);

  _ASSERT && common.assert(this.getHeight() == this.computeHeight());
}

/**
 * Get the maximum balance of an node in the tree. The balance is the difference
 * in height of the two children of a node.
 */
DynamicTree.prototype.getMaxBalance = function() {
  var maxBalance = 0;
  var node, it = iteratorPool.allocate().preorder(this.m_root);
  while (node = it.next()) {
    if (node.height <= 1) {
      continue;
    }

    _ASSERT && common.assert(node.isLeaf() == false);

    var balance = Math.abs(node.child2.height - node.child1.height);
    maxBalance = Math.max(maxBalance, balance);
  }
  iteratorPool.release(it);

  return maxBalance;
}

/**
 * Build an optimal tree. Very expensive. For testing.
 */
DynamicTree.prototype.rebuildBottomUp = function() {
  var nodes = [];
  var count = 0;

  // Build array of leaves. Free the rest.
  var node, it = iteratorPool.allocate().preorder(this.m_root);
  while (node = it.next()) {
    if (node.height < 0) {
      // free node in pool
      continue;
    }

    if (node.isLeaf()) {
      node.parent = null;
      nodes[count] = node;
      ++count;
    } else {
      this.freeNode(node);
    }
  }
  iteratorPool.release(it);

  while (count > 1) {
    var minCost = Infinity;
    var iMin = -1, jMin = -1;
    for (var i = 0; i < count; ++i) {
      var aabbi = nodes[i].aabb;
      for (var j = i + 1; j < count; ++j) {
        var aabbj = nodes[j].aabb;
        var b = new AABB();
        b.combine(aabbi, aabbj);
        var cost = b.getPerimeter();
        if (cost < minCost) {
          iMin = i;
          jMin = j;
          minCost = cost;
        }
      }
    }

    var child1 = nodes[iMin];
    var child2 = nodes[jMin];

    var parent = this.allocateNode();
    parent.child1 = child1;
    parent.child2 = child2;
    parent.height = 1 + Math.max(child1.height, child2.height);
    parent.aabb.combine(child1.aabb, child2.aabb);
    parent.parent = null;

    child1.parent = parent;
    child2.parent = parent;

    nodes[jMin] = nodes[count - 1];
    nodes[iMin] = parent;
    --count;
  }

  this.m_root = nodes[0];

  this.validate();
}

/**
 * Shift the world origin. Useful for large worlds. The shift formula is:
 * position -= newOrigin
 * 
 * @param newOrigin The new origin with respect to the old origin
 */
DynamicTree.prototype.shiftOrigin = function(newOrigin) {
  // Build array of leaves. Free the rest.
  var node, it = iteratorPool.allocate().preorder(this.m_root);
  while (node = it.next()) {
    var aabb = node.aabb;
    aabb.lowerBound.x -= newOrigin.x;
    aabb.lowerBound.y -= newOrigin.y;
    aabb.upperBound.x -= newOrigin.x;
    aabb.upperBound.y -= newOrigin.y;
  }
  iteratorPool.release(it);
}

/**
 * @function {DynamicTree~queryCallback}
 * 
 * @param id Node id.
 */

/**
 * Query an AABB for overlapping proxies. The callback class is called for each
 * proxy that overlaps the supplied AABB.
 * 
 * @param {DynamicTree~queryCallback} queryCallback
 */
DynamicTree.prototype.query = function(aabb, queryCallback) {
  _ASSERT && common.assert(typeof queryCallback === 'function')
  var stack = stackPool.allocate();

  stack.push(this.m_root);
  while (stack.length > 0) {
    var node = stack.pop();
    if (node == null) {
      continue;
    }

    if (AABB.testOverlap(node.aabb, aabb)) {
      if (node.isLeaf()) {
        var proceed = queryCallback(node.id);
        if (proceed == false) {
          return;
        }
      } else {
        stack.push(node.child1);
        stack.push(node.child2);
      }
    }
  }

  stackPool.release(stack);
}

/**
 * Ray-cast against the proxies in the tree. This relies on the callback to
 * perform a exact ray-cast in the case were the proxy contains a shape. The
 * callback also performs the any collision filtering. This has performance
 * roughly equal to k * log(n), where k is the number of collisions and n is the
 * number of proxies in the tree.
 * 
 * @param input The ray-cast input data. The ray extends from p1 to p1 +
 *          maxFraction * (p2 - p1).
 * @param rayCastCallback A function that is called for each proxy that is hit by
 *          the ray.
 */
DynamicTree.prototype.rayCast = function(input, rayCastCallback) { // TODO GC
  _ASSERT && common.assert(typeof rayCastCallback === 'function')
  var p1 = input.p1;
  var p2 = input.p2;
  var r = Vec2.sub(p2, p1);
  _ASSERT && common.assert(r.lengthSquared() > 0.0);
  r.normalize();

  // v is perpendicular to the segment.
  var v = Vec2.cross(1.0, r);
  var abs_v = Vec2.abs(v);

  // Separating axis for segment (Gino, p80).
  // |dot(v, p1 - c)| > dot(|v|, h)

  var maxFraction = input.maxFraction;

  // Build a bounding box for the segment.
  var segmentAABB = new AABB();
  var t = Vec2.combine((1 - maxFraction), p1, maxFraction, p2);
  segmentAABB.combinePoints(p1, t);

  var stack = stackPool.allocate();
  var subInput = inputPool.allocate();

  stack.push(this.m_root);
  while (stack.length > 0) {
    var node = stack.pop();
    if (node == null) {
      continue;
    }

    if (AABB.testOverlap(node.aabb, segmentAABB) == false) {
      continue;
    }

    // Separating axis for segment (Gino, p80).
    // |dot(v, p1 - c)| > dot(|v|, h)
    var c = node.aabb.getCenter();
    var h = node.aabb.getExtents();
    var separation = Math.abs(Vec2.dot(v, Vec2.sub(p1, c)))
        - Vec2.dot(abs_v, h);
    if (separation > 0.0) {
      continue;
    }

    if (node.isLeaf()) {
      subInput.p1 = Vec2.clone(input.p1);
      subInput.p2 = Vec2.clone(input.p2);
      subInput.maxFraction = maxFraction;

      var value = rayCastCallback(subInput, node.id);

      if (value == 0.0) {
        // The client has terminated the ray cast.
        return;
      }

      if (value > 0.0) {
        // update segment bounding box.
        maxFraction = value;
        t = Vec2.combine((1 - maxFraction), p1, maxFraction, p2);
        segmentAABB.combinePoints(p1, t);
      }
    } else {
      stack.push(node.child1);
      stack.push(node.child2);
    }
  }

  stackPool.release(stack);
  inputPool.release(subInput);
}

var inputPool = new Pool({
  create : function() {
    return {};
  },
  release : function(stack) {
  }
});

var stackPool = new Pool({
  create : function() {
    return [];
  },
  release : function(stack) {
    stack.length = 0;
  }
});

var iteratorPool = new Pool({
  create : function() {
    return new Iterator();
  },
  release : function(iterator) {
    iterator.close();
  }
});

function Iterator() {
  var parents = [];
  var states = [];
  return {
    preorder : function(root) {
      parents.length = 0;
      parents.push(root);
      states.length = 0;
      states.push(0);
      return this;
    },
    next : function() {
      while (parents.length > 0) {
        var i = parents.length - 1;
        var node = parents[i];
        if (states[i] === 0) {
          states[i] = 1;
          return node;
        }
        if (states[i] === 1) {
          states[i] = 2;
          if (node.child1) {
            parents.push(node.child1);
            states.push(1);
            return node.child1;
          }
        }
        if (states[i] === 2) {
          states[i] = 3;
          if (node.child2) {
            parents.push(node.child2);
            states.push(1);
            return node.child2;
          }
        }
        parents.pop();
        states.pop();
      }
    },
    close : function() {
      parents.length = 0;
    }
  };
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/collision/TimeOfImpact.js":
/*!******************************************************************!*\
  !*** ../../node_modules/planck-js/lib/collision/TimeOfImpact.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = TimeOfImpact;
module.exports.Input = TOIInput;
module.exports.Output = TOIOutput;

var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Timer = __webpack_require__(/*! ../util/Timer */ "../../node_modules/planck-js/lib/util/Timer.js");

var stats = __webpack_require__(/*! ../common/stats */ "../../node_modules/planck-js/lib/common/stats.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Distance = __webpack_require__(/*! ./Distance */ "../../node_modules/planck-js/lib/collision/Distance.js");
var DistanceInput = Distance.Input;
var DistanceOutput = Distance.Output;
var DistanceProxy = Distance.Proxy;
var SimplexCache = Distance.Cache;

/**
 * Input parameters for TimeOfImpact.
 * 
 * @prop {DistanceProxy} proxyA
 * @prop {DistanceProxy} proxyB
 * @prop {Sweep} sweepA
 * @prop {Sweep} sweepB
 * @prop tMax defines sweep interval [0, tMax]
 */
function TOIInput() {
  this.proxyA = new DistanceProxy();
  this.proxyB = new DistanceProxy();
  this.sweepA = new Sweep();
  this.sweepB = new Sweep();
  this.tMax;
};

// TOIOutput State
TOIOutput.e_unknown = 0;
TOIOutput.e_failed = 1;
TOIOutput.e_overlapped = 2;
TOIOutput.e_touching = 3;
TOIOutput.e_separated = 4;

/**
 * Output parameters for TimeOfImpact.
 * 
 * @prop state
 * @prop t
 */
function TOIOutput() {
  this.state;
  this.t;
};

stats.toiTime = 0;
stats.toiMaxTime = 0;
stats.toiCalls = 0;
stats.toiIters = 0;
stats.toiMaxIters = 0;
stats.toiRootIters = 0;
stats.toiMaxRootIters = 0;

/**
 * Compute the upper bound on time before two shapes penetrate. Time is
 * represented as a fraction between [0,tMax]. This uses a swept separating axis
 * and may miss some intermediate, non-tunneling collision. If you change the
 * time interval, you should call this function again.
 * 
 * Note: use Distance to compute the contact point and normal at the time of
 * impact.
 * 
 * CCD via the local separating axis method. This seeks progression by computing
 * the largest time at which separation is maintained.
 */
function TimeOfImpact(output, input) {
  var timer = Timer.now();

  ++stats.toiCalls;

  output.state = TOIOutput.e_unknown;
  output.t = input.tMax;

  var proxyA = input.proxyA; // DistanceProxy
  var proxyB = input.proxyB; // DistanceProxy

  var sweepA = input.sweepA; // Sweep
  var sweepB = input.sweepB; // Sweep

  // Large rotations can make the root finder fail, so we normalize the
  // sweep angles.
  sweepA.normalize();
  sweepB.normalize();

  var tMax = input.tMax;

  var totalRadius = proxyA.m_radius + proxyB.m_radius;
  var target = Math.max(Settings.linearSlop, totalRadius - 3.0 * Settings.linearSlop);
  var tolerance = 0.25 * Settings.linearSlop;
  _ASSERT && common.assert(target > tolerance);

  var t1 = 0.0;
  var k_maxIterations = Settings.maxTOIIterations;
  var iter = 0;

  // Prepare input for distance query.
  var cache = new SimplexCache();

  var distanceInput = new DistanceInput();
  distanceInput.proxyA = input.proxyA;
  distanceInput.proxyB = input.proxyB;
  distanceInput.useRadii = false;

  // The outer loop progressively attempts to compute new separating axes.
  // This loop terminates when an axis is repeated (no progress is made).
  for (;;) {
    var xfA = Transform.identity();
    var xfB = Transform.identity();
    sweepA.getTransform(xfA, t1);
    sweepB.getTransform(xfB, t1);

    // Get the distance between shapes. We can also use the results
    // to get a separating axis.
    distanceInput.transformA = xfA;
    distanceInput.transformB = xfB;
    var distanceOutput = new DistanceOutput();
    Distance(distanceOutput, cache, distanceInput);

    // If the shapes are overlapped, we give up on continuous collision.
    if (distanceOutput.distance <= 0.0) {
      // Failure!
      output.state = TOIOutput.e_overlapped;
      output.t = 0.0;
      break;
    }

    if (distanceOutput.distance < target + tolerance) {
      // Victory!
      output.state = TOIOutput.e_touching;
      output.t = t1;
      break;
    }

    // Initialize the separating axis.
    var fcn = new SeparationFunction();
    fcn.initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);

    // if (false) {
    //   // Dump the curve seen by the root finder
    //   var N = 100;
    //   var dx = 1.0 / N;
    //   var xs = []; // [ N + 1 ];
    //   var fs = []; // [ N + 1 ];
    //   var x = 0.0;
    //   for (var i = 0; i <= N; ++i) {
    //     sweepA.getTransform(xfA, x);
    //     sweepB.getTransform(xfB, x);
    //     var f = fcn.evaluate(xfA, xfB) - target;
    //     printf("%g %g\n", x, f);
    //     xs[i] = x;
    //     fs[i] = f;
    //     x += dx;
    //   }
    // }

    // Compute the TOI on the separating axis. We do this by successively
    // resolving the deepest point. This loop is bounded by the number of
    // vertices.
    var done = false;
    var t2 = tMax;
    var pushBackIter = 0;
    for (;;) {
      // Find the deepest point at t2. Store the witness point indices.
      var s2 = fcn.findMinSeparation(t2);
      var indexA = fcn.indexA;
      var indexB = fcn.indexB;

      // Is the final configuration separated?
      if (s2 > target + tolerance) {
        // Victory!
        output.state = TOIOutput.e_separated;
        output.t = tMax;
        done = true;
        break;
      }

      // Has the separation reached tolerance?
      if (s2 > target - tolerance) {
        // Advance the sweeps
        t1 = t2;
        break;
      }

      // Compute the initial separation of the witness points.
      var s1 = fcn.evaluate(t1);
      var indexA = fcn.indexA;
      var indexB = fcn.indexB;

      // Check for initial overlap. This might happen if the root finder
      // runs out of iterations.
      if (s1 < target - tolerance) {
        output.state = TOIOutput.e_failed;
        output.t = t1;
        done = true;
        break;
      }

      // Check for touching
      if (s1 <= target + tolerance) {
        // Victory! t1 should hold the TOI (could be 0.0).
        output.state = TOIOutput.e_touching;
        output.t = t1;
        done = true;
        break;
      }

      // Compute 1D root of: f(x) - target = 0
      var rootIterCount = 0;
      var a1 = t1, a2 = t2;
      for (;;) {
        // Use a mix of the secant rule and bisection.
        var t;
        if (rootIterCount & 1) {
          // Secant rule to improve convergence.
          t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
        } else {
          // Bisection to guarantee progress.
          t = 0.5 * (a1 + a2);
        }

        ++rootIterCount;
        ++stats.toiRootIters;

        var s = fcn.evaluate(t);
        var indexA = fcn.indexA;
        var indexB = fcn.indexB;

        if (Math.abs(s - target) < tolerance) {
          // t2 holds a tentative value for t1
          t2 = t;
          break;
        }

        // Ensure we continue to bracket the root.
        if (s > target) {
          a1 = t;
          s1 = s;
        } else {
          a2 = t;
          s2 = s;
        }

        if (rootIterCount == 50) {
          break;
        }
      }

      stats.toiMaxRootIters = Math.max(stats.toiMaxRootIters, rootIterCount);

      ++pushBackIter;

      if (pushBackIter == Settings.maxPolygonVertices) {
        break;
      }
    }

    ++iter;
    ++stats.toiIters;

    if (done) {
      break;
    }

    if (iter == k_maxIterations) {
      // Root finder got stuck. Semi-victory.
      output.state = TOIOutput.e_failed;
      output.t = t1;
      break;
    }
  }

  stats.toiMaxIters = Math.max(stats.toiMaxIters, iter);

  var time = Timer.diff(timer);
  stats.toiMaxTime = Math.max(stats.toiMaxTime, time);
  stats.toiTime += time;
}

// SeparationFunction Type
var e_points = 1;
var e_faceA = 2;
var e_faceB = 3;

function SeparationFunction() {
  this.m_proxyA = new DistanceProxy();
  this.m_proxyB = new DistanceProxy();
  this.m_sweepA;// Sweep
  this.m_sweepB;// Sweep
  this.indexA;// integer
  this.indexB;// integer
  this.m_type;
  this.m_localPoint = Vec2.zero();
  this.m_axis = Vec2.zero();
};

// TODO_ERIN might not need to return the separation

/**
 * @param {SimplexCache} cache
 * @param {DistanceProxy} proxyA
 * @param {Sweep} sweepA
 * @param {DistanceProxy} proxyB
 * @param {Sweep} sweepB
 * @param {float} t1
 */
SeparationFunction.prototype.initialize = function(cache, proxyA, sweepA, proxyB, sweepB, t1) {
  this.m_proxyA = proxyA;
  this.m_proxyB = proxyB;
  var count = cache.count;
  _ASSERT && common.assert(0 < count && count < 3);

  this.m_sweepA = sweepA;
  this.m_sweepB = sweepB;

  var xfA = Transform.identity();
  var xfB = Transform.identity();
  this.m_sweepA.getTransform(xfA, t1);
  this.m_sweepB.getTransform(xfB, t1);

  if (count == 1) {
    this.m_type = e_points;
    var localPointA = this.m_proxyA.getVertex(cache.indexA[0]);
    var localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
    var pointA = Transform.mulVec2(xfA, localPointA);
    var pointB = Transform.mulVec2(xfB, localPointB);
    this.m_axis.setCombine(1, pointB, -1, pointA);
    var s = this.m_axis.normalize();
    return s;

  } else if (cache.indexA[0] == cache.indexA[1]) {
    // Two points on B and one on A.
    this.m_type = e_faceB;
    var localPointB1 = proxyB.getVertex(cache.indexB[0]);
    var localPointB2 = proxyB.getVertex(cache.indexB[1]);

    this.m_axis = Vec2.cross(Vec2.sub(localPointB2, localPointB1), 1.0);
    this.m_axis.normalize();
    var normal = Rot.mulVec2(xfB.q, this.m_axis);

    this.m_localPoint = Vec2.mid(localPointB1, localPointB2);
    var pointB = Transform.mulVec2(xfB, this.m_localPoint);

    var localPointA = proxyA.getVertex(cache.indexA[0]);
    var pointA = Transform.mulVec2(xfA, localPointA);

    var s = Vec2.dot(pointA, normal) - Vec2.dot(pointB, normal);
    if (s < 0.0) {
      this.m_axis = Vec2.neg(this.m_axis);
      s = -s;
    }
    return s;

  } else {
    // Two points on A and one or two points on B.
    this.m_type = e_faceA;
    var localPointA1 = this.m_proxyA.getVertex(cache.indexA[0]);
    var localPointA2 = this.m_proxyA.getVertex(cache.indexA[1]);

    this.m_axis = Vec2.cross(Vec2.sub(localPointA2, localPointA1), 1.0);
    this.m_axis.normalize();
    var normal = Rot.mulVec2(xfA.q, this.m_axis);

    this.m_localPoint = Vec2.mid(localPointA1, localPointA2);
    var pointA = Transform.mulVec2(xfA, this.m_localPoint);

    var localPointB = this.m_proxyB.getVertex(cache.indexB[0]);
    var pointB = Transform.mulVec2(xfB, localPointB);

    var s = Vec2.dot(pointB, normal) - Vec2.dot(pointA, normal);
    if (s < 0.0) {
      this.m_axis = Vec2.neg(this.m_axis);
      s = -s;
    }
    return s;
  }
};

SeparationFunction.prototype.compute = function(find, t) {
  // It was findMinSeparation and evaluate
  var xfA = Transform.identity();
  var xfB = Transform.identity();
  this.m_sweepA.getTransform(xfA, t);
  this.m_sweepB.getTransform(xfB, t);

  switch (this.m_type) {
  case e_points: {
    if (find) {
      var axisA = Rot.mulTVec2(xfA.q, this.m_axis);
      var axisB = Rot.mulTVec2(xfB.q, Vec2.neg(this.m_axis));

      this.indexA = this.m_proxyA.getSupport(axisA);
      this.indexB = this.m_proxyB.getSupport(axisB);
    }

    var localPointA = this.m_proxyA.getVertex(this.indexA);
    var localPointB = this.m_proxyB.getVertex(this.indexB);

    var pointA = Transform.mulVec2(xfA, localPointA);
    var pointB = Transform.mulVec2(xfB, localPointB);

    var sep = Vec2.dot(pointB, this.m_axis) - Vec2.dot(pointA, this.m_axis);
    return sep;
  }

  case e_faceA: {
    var normal = Rot.mulVec2(xfA.q, this.m_axis);
    var pointA = Transform.mulVec2(xfA, this.m_localPoint);

    if (find) {
      var axisB = Rot.mulTVec2(xfB.q, Vec2.neg(normal));

      this.indexA = -1;
      this.indexB = this.m_proxyB.getSupport(axisB);
    }

    var localPointB = this.m_proxyB.getVertex(this.indexB);
    var pointB = Transform.mulVec2(xfB, localPointB);

    var sep = Vec2.dot(pointB, normal) - Vec2.dot(pointA, normal);
    return sep;
  }

  case e_faceB: {
    var normal = Rot.mulVec2(xfB.q, this.m_axis);
    var pointB = Transform.mulVec2(xfB, this.m_localPoint);

    if (find) {
      var axisA = Rot.mulTVec2(xfA.q, Vec2.neg(normal));

      this.indexB = -1;
      this.indexA = this.m_proxyA.getSupport(axisA);
    }

    var localPointA = this.m_proxyA.getVertex(this.indexA);
    var pointA = Transform.mulVec2(xfA, localPointA);

    var sep = Vec2.dot(pointA, normal) - Vec2.dot(pointB, normal);
    return sep;
  }

  default:
    _ASSERT && common.assert(false);
    if (find) {
      this.indexA = -1;
      this.indexB = -1;
    }
    return 0.0;
  }
};

SeparationFunction.prototype.findMinSeparation = function(t) {
  return this.compute(true, t);
};

SeparationFunction.prototype.evaluate = function(t) {
  return this.compute(false, t);
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Mat22.js":
/*!********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Mat22.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Mat22;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");

/**
 * A 2-by-2 matrix. Stored in column-major order.
 */
function Mat22(a, b, c, d) {
  if (typeof a === 'object' && a !== null) {
    this.ex = Vec2.clone(a);
    this.ey = Vec2.clone(b);
  } else if (typeof a === 'number') {
    this.ex = Vec2.neo(a, c);
    this.ey = Vec2.neo(b, d)
  } else {
    this.ex = Vec2.zero();
    this.ey = Vec2.zero()
  }
};

Mat22.prototype.toString = function() {
  return JSON.stringify(this);
};

Mat22.isValid = function(o) {
  return o && Vec2.isValid(o.ex) && Vec2.isValid(o.ey);
};

Mat22.assert = function(o) {
  if (!_ASSERT) return;
  if (!Mat22.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Mat22!');
  }
};

Mat22.prototype.set = function(a, b, c, d) {
  if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number'
      && typeof d === 'number') {
    this.ex.set(a, c);
    this.ey.set(b, d);

  } else if (typeof a === 'object' && typeof b === 'object') {
    this.ex.set(a);
    this.ey.set(b);

  } else if (typeof a === 'object') {
    _ASSERT && Mat22.assert(a);
    this.ex.set(a.ex);
    this.ey.set(a.ey);

  } else {
    _ASSERT && common.assert(false);
  }
}

Mat22.prototype.setIdentity = function() {
  this.ex.x = 1.0;
  this.ey.x = 0.0;
  this.ex.y = 0.0;
  this.ey.y = 1.0;
}

Mat22.prototype.setZero = function() {
  this.ex.x = 0.0;
  this.ey.x = 0.0;
  this.ex.y = 0.0;
  this.ey.y = 0.0;
}

Mat22.prototype.getInverse = function() {
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var imx = new Mat22();
  imx.ex.x = det * d;
  imx.ey.x = -det * b;
  imx.ex.y = -det * c;
  imx.ey.y = det * a;
  return imx;
}

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases.
 */
Mat22.prototype.solve = function(v) {
  _ASSERT && Vec2.assert(v);
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var w = Vec2.zero();
  w.x = det * (d * v.x - b * v.y);
  w.y = det * (a * v.y - c * v.x);
  return w;
}

/**
 * Multiply a matrix times a vector. If a rotation matrix is provided, then this
 * transforms the vector from one frame to another.
 */
Mat22.mul = function(mx, v) {
  if (v && 'x' in v && 'y' in v) {
    _ASSERT && Vec2.assert(v);
    var x = mx.ex.x * v.x + mx.ey.x * v.y;
    var y = mx.ex.y * v.x + mx.ey.y * v.y;
    return Vec2.neo(x, y);

  } else if (v && 'ex' in v && 'ey' in v) { // Mat22
    _ASSERT && Mat22.assert(v);
    // return new Mat22(Vec2.mul(mx, v.ex), Vec2.mul(mx, v.ey));
    var a = mx.ex.x * v.ex.x + mx.ey.x * v.ex.y;
    var b = mx.ex.x * v.ey.x + mx.ey.x * v.ey.y;
    var c = mx.ex.y * v.ex.x + mx.ey.y * v.ex.y;
    var d = mx.ex.y * v.ey.x + mx.ey.y * v.ey.y;
    return new Mat22(a, b, c, d);
  }

  _ASSERT && common.assert(false);
}

Mat22.mulVec2 = function(mx, v) {
  _ASSERT && Vec2.assert(v);
  var x = mx.ex.x * v.x + mx.ey.x * v.y;
  var y = mx.ex.y * v.x + mx.ey.y * v.y;
  return Vec2.neo(x, y);
}

Mat22.mulMat22 = function(mx, v) {
  _ASSERT && Mat22.assert(v);
  // return new Mat22(Vec2.mul(mx, v.ex), Vec2.mul(mx, v.ey));
  var a = mx.ex.x * v.ex.x + mx.ey.x * v.ex.y;
  var b = mx.ex.x * v.ey.x + mx.ey.x * v.ey.y;
  var c = mx.ex.y * v.ex.x + mx.ey.y * v.ex.y;
  var d = mx.ex.y * v.ey.x + mx.ey.y * v.ey.y;
  return new Mat22(a, b, c, d);
  _ASSERT && common.assert(false);
}

/**
 * Multiply a matrix transpose times a vector. If a rotation matrix is provided,
 * then this transforms the vector from one frame to another (inverse
 * transform).
 */
Mat22.mulT = function(mx, v) {
  if (v && 'x' in v && 'y' in v) { // Vec2
    _ASSERT && Vec2.assert(v);
    return Vec2.neo(Vec2.dot(v, mx.ex), Vec2.dot(v, mx.ey));

  } else if (v && 'ex' in v && 'ey' in v) { // Mat22
    _ASSERT && Mat22.assert(v);
    var c1 = Vec2.neo(Vec2.dot(mx.ex, v.ex), Vec2.dot(mx.ey, v.ex));
    var c2 = Vec2.neo(Vec2.dot(mx.ex, v.ey), Vec2.dot(mx.ey, v.ey));
    return new Mat22(c1, c2);
  }

  _ASSERT && common.assert(false);
}

Mat22.mulTVec2 = function(mx, v) {
  _ASSERT && Mat22.assert(mx);
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(Vec2.dot(v, mx.ex), Vec2.dot(v, mx.ey));
}

Mat22.mulTMat22 = function(mx, v) {
  _ASSERT && Mat22.assert(mx);
  _ASSERT && Mat22.assert(v);
  var c1 = Vec2.neo(Vec2.dot(mx.ex, v.ex), Vec2.dot(mx.ey, v.ex));
  var c2 = Vec2.neo(Vec2.dot(mx.ex, v.ey), Vec2.dot(mx.ey, v.ey));
  return new Mat22(c1, c2);
}

Mat22.abs = function(mx) {
  _ASSERT && Mat22.assert(mx);
  return new Mat22(Vec2.abs(mx.ex), Vec2.abs(mx.ey));
}

Mat22.add = function(mx1, mx2) {
  _ASSERT && Mat22.assert(mx1);
  _ASSERT && Mat22.assert(mx2);
  return new Mat22(Vec2.add(mx1.ex, mx2.ex), Vec2.add(mx1.ey, mx2.ey));
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Mat33.js":
/*!********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Mat33.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Mat33;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ./Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");

/**
 * A 3-by-3 matrix. Stored in column-major order.
 */
function Mat33(a, b, c) {
  if (typeof a === 'object' && a !== null) {
    this.ex = Vec3.clone(a);
    this.ey = Vec3.clone(b);
    this.ez = Vec3.clone(c);
  } else {
    this.ex = Vec3();
    this.ey = Vec3();
    this.ez = Vec3();
  }
};

Mat33.prototype.toString = function() {
  return JSON.stringify(this);
};

Mat33.isValid = function(o) {
  return o && Vec3.isValid(o.ex) && Vec3.isValid(o.ey) && Vec3.isValid(o.ez);
};

Mat33.assert = function(o) {
  if (!_ASSERT) return;
  if (!Mat33.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Mat33!');
  }
};

/**
 * Set this matrix to all zeros.
 */
Mat33.prototype.setZero = function() {
  this.ex.setZero();
  this.ey.setZero();
  this.ez.setZero();
  return this;
}

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases.
 * 
 * @param {Vec3} v
 * @returns {Vec3}
 */
Mat33.prototype.solve33 = function(v) {
  var det = Vec3.dot(this.ex, Vec3.cross(this.ey, this.ez));
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var r = new Vec3();
  r.x = det * Vec3.dot(v, Vec3.cross(this.ey, this.ez));
  r.y = det * Vec3.dot(this.ex, Vec3.cross(v, this.ez));
  r.z = det * Vec3.dot(this.ex, Vec3.cross(this.ey, v));
  return r;
}

/**
 * Solve A * x = b, where b is a column vector. This is more efficient than
 * computing the inverse in one-shot cases. Solve only the upper 2-by-2 matrix
 * equation.
 * 
 * @param {Vec2} v
 * 
 * @returns {Vec2}
 */
Mat33.prototype.solve22 = function(v) {
  var a11 = this.ex.x;
  var a12 = this.ey.x;
  var a21 = this.ex.y;
  var a22 = this.ey.y;
  var det = a11 * a22 - a12 * a21;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var r = Vec2.zero();
  r.x = det * (a22 * v.x - a12 * v.y);
  r.y = det * (a11 * v.y - a21 * v.x);
  return r;
}

/**
 * Get the inverse of this matrix as a 2-by-2. Returns the zero matrix if
 * singular.
 * 
 * @param {Mat33} M
 */
Mat33.prototype.getInverse22 = function(M) {
  var a = this.ex.x;
  var b = this.ey.x;
  var c = this.ex.y;
  var d = this.ey.y;
  var det = a * d - b * c;
  if (det != 0.0) {
    det = 1.0 / det;
  }
  M.ex.x = det * d;
  M.ey.x = -det * b;
  M.ex.z = 0.0;
  M.ex.y = -det * c;
  M.ey.y = det * a;
  M.ey.z = 0.0;
  M.ez.x = 0.0;
  M.ez.y = 0.0;
  M.ez.z = 0.0;
}

/**
 * Get the symmetric inverse of this matrix as a 3-by-3. Returns the zero matrix
 * if singular.
 * 
 * @param {Mat33} M
 */
Mat33.prototype.getSymInverse33 = function(M) {
  var det = Vec3.dot(this.ex, Vec3.cross(this.ey, this.ez));
  if (det != 0.0) {
    det = 1.0 / det;
  }
  var a11 = this.ex.x;
  var a12 = this.ey.x;
  var a13 = this.ez.x;
  var a22 = this.ey.y;
  var a23 = this.ez.y;
  var a33 = this.ez.z;

  M.ex.x = det * (a22 * a33 - a23 * a23);
  M.ex.y = det * (a13 * a23 - a12 * a33);
  M.ex.z = det * (a12 * a23 - a13 * a22);

  M.ey.x = M.ex.y;
  M.ey.y = det * (a11 * a33 - a13 * a13);
  M.ey.z = det * (a13 * a12 - a11 * a23);

  M.ez.x = M.ex.z;
  M.ez.y = M.ey.z;
  M.ez.z = det * (a11 * a22 - a12 * a12);
}

/**
 * Multiply a matrix times a vector.
 * 
 * @param {Mat33} a
 * @param {Vec3|Vec2} b
 * 
 * @returns {Vec3|Vec2}
 */
Mat33.mul = function(a, b) {
  _ASSERT && Mat33.assert(a);
  if (b && 'z' in b && 'y' in b && 'x' in b) {
    _ASSERT && Vec3.assert(b);
    var x = a.ex.x * b.x + a.ey.x * b.y + a.ez.x * b.z;
    var y = a.ex.y * b.x + a.ey.y * b.y + a.ez.y * b.z;
    var z = a.ex.z * b.x + a.ey.z * b.y + a.ez.z * b.z;
    return new Vec3(x, y, z);

  } else if (b && 'y' in b && 'x' in b) {
    _ASSERT && Vec2.assert(b);
    var x = a.ex.x * b.x + a.ey.x * b.y;
    var y = a.ex.y * b.x + a.ey.y * b.y;
    return Vec2.neo(x, y);
  }

  _ASSERT && common.assert(false);
}

Mat33.mulVec3 = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Vec3.assert(b);
  var x = a.ex.x * b.x + a.ey.x * b.y + a.ez.x * b.z;
  var y = a.ex.y * b.x + a.ey.y * b.y + a.ez.y * b.z;
  var z = a.ex.z * b.x + a.ey.z * b.y + a.ez.z * b.z;
  return new Vec3(x, y, z);
}

Mat33.mulVec2 = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Vec2.assert(b);
  var x = a.ex.x * b.x + a.ey.x * b.y;
  var y = a.ex.y * b.x + a.ey.y * b.y;
  return Vec2.neo(x, y);
}

Mat33.add = function(a, b) {
  _ASSERT && Mat33.assert(a);
  _ASSERT && Mat33.assert(b);
  return new Mat33(
    Vec3.add(a.ex, b.ex),
    Vec3.add(a.ey, b.ey),
    Vec3.add(a.ez, b.ez)
  );
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Math.js":
/*!*******************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Math.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var native = Math;
var math = module.exports = Object.create(native);

math.EPSILON = 1e-9; // TODO

/**
 * This function is used to ensure that a floating point number is not a NaN or
 * infinity.
 */
math.isFinite = function(x) {
  return (typeof x === 'number') && isFinite(x) && !isNaN(x);
}

math.assert = function(x) {
  if (!_ASSERT) return;
  if (!math.isFinite(x)) {
    _DEBUG && common.debug(x);
    throw new Error('Invalid Number!');
  }
}

/**
 * TODO: This is a approximate yet fast inverse square-root.
 */
math.invSqrt = function(x) {
  // TODO
  return 1 / native.sqrt(x);
}

/**
 * Next Largest Power of 2 Given a binary integer value x, the next largest
 * power of 2 can be computed by a SWAR algorithm that recursively "folds" the
 * upper bits into the lower bits. This process yields a bit vector with the
 * same most significant 1 as x, but all 1's below it. Adding 1 to that value
 * yields the next largest power of 2. For a 32-bit value:
 */
math.nextPowerOfTwo = function(x) {
  // TODO
  x |= (x >> 1);
  x |= (x >> 2);
  x |= (x >> 4);
  x |= (x >> 8);
  x |= (x >> 16);
  return x + 1;
}

math.isPowerOfTwo = function(x) {
  return x > 0 && (x & (x - 1)) == 0;
}

math.mod = function(num, min, max) {
  if (typeof min === 'undefined') {
    max = 1, min = 0;
  } else if (typeof max === 'undefined') {
    max = min, min = 0;
  }
  if (max > min) {
    num = (num - min) % (max - min);
    return num + (num < 0 ? max : min);
  } else {
    num = (num - max) % (min - max);
    return num + (num <= 0 ? min : max);
  }
};

math.clamp = function(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
};

math.random = function(min, max) {
  if (typeof min === 'undefined') {
    max = 1;
    min = 0;
  } else if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }
  return min == max ? min : native.random() * (max - min) + min;
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Position.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Position.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Position;

var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ./Rot */ "../../node_modules/planck-js/lib/common/Rot.js");

/**
 * @prop {Vec2} c location
 * @prop {float} a angle
 */
function Position() {
  this.c = Vec2.zero();
  this.a = 0;
}

Position.prototype.getTransform = function(xf, p) {
  xf.q.set(this.a);
  xf.p.set(Vec2.sub(this.c, Rot.mulVec2(xf.q, p)));
  return xf;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Rot.js":
/*!******************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Rot.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Rot;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");

// TODO merge with Transform

/**
 * Initialize from an angle in radians.
 */
function Rot(angle) {
  if (!(this instanceof Rot)) {
    return new Rot(angle);
  }
  if (typeof angle === 'number') {
    this.setAngle(angle);
  } else if (typeof angle === 'object') {
      this.set(angle);
  } else {
    this.setIdentity();
  }
}

Rot.neo = function(angle) {
  var obj = Object.create(Rot.prototype);
  obj.setAngle(angle);
  return obj;
};

Rot.clone = function(rot) {
  _ASSERT && Rot.assert(rot);
  var obj = Object.create(Rot.prototype);
  obj.s = rot.s;
  obj.c = rot.c;
  return obj;
};

Rot.identity = function() {
  var obj = Object.create(Rot.prototype);
  obj.s = 0.0;
  obj.c = 1.0;
  return obj;
};

Rot.isValid = function(o) {
  return o && Math.isFinite(o.s) && Math.isFinite(o.c);
}

Rot.assert = function(o) {
  if (!_ASSERT) return;
  if (!Rot.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Rot!');
  }
}

/**
 * Set to the identity rotation.
 */
Rot.prototype.setIdentity = function() {
  this.s = 0.0;
  this.c = 1.0;
}

Rot.prototype.set = function(angle) {
  if (typeof angle === 'object') {
    _ASSERT && Rot.assert(angle);
    this.s = angle.s;
    this.c = angle.c;

  } else {
    _ASSERT && Math.assert(angle);
    // TODO_ERIN optimize
    this.s = Math.sin(angle);
    this.c = Math.cos(angle);
  }
}

/**
 * Set using an angle in radians.
 */
Rot.prototype.setAngle = function(angle) {
  _ASSERT && Math.assert(angle);
  // TODO_ERIN optimize
  this.s = Math.sin(angle);
  this.c = Math.cos(angle);
};

/**
 * Get the angle in radians.
 */
Rot.prototype.getAngle = function() {
  return Math.atan2(this.s, this.c);
}

/**
 * Get the x-axis.
 */
Rot.prototype.getXAxis = function() {
  return Vec2.neo(this.c, this.s);
}

/**
 * Get the u-axis.
 */
Rot.prototype.getYAxis = function() {
  return Vec2.neo(-this.s, this.c);
}

/**
 * Multiply two rotations: q * r
 * 
 * @returns Rot
 * 
 * Rotate a vector
 * 
 * @returns Vec2
 */
Rot.mul = function(rot, m) {
  _ASSERT && Rot.assert(rot);
  if ('c' in m && 's' in m) {
    _ASSERT && Rot.assert(m);
    // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
    // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
    // s = qs * rc + qc * rs
    // c = qc * rc - qs * rs
    var qr = Rot.identity();
    qr.s = rot.s * m.c + rot.c * m.s;
    qr.c = rot.c * m.c - rot.s * m.s;
    return qr;

  } else if ('x' in m && 'y' in m) {
    _ASSERT && Vec2.assert(m);
    return Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
  }
}

Rot.mulRot = function(rot, m) {
  _ASSERT && Rot.assert(rot);
  _ASSERT && Rot.assert(m);
  // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
  // [qs qc] [rs rc] [qs*rc+qc*rs -qs*rs+qc*rc]
  // s = qs * rc + qc * rs
  // c = qc * rc - qs * rs
  var qr = Rot.identity();
  qr.s = rot.s * m.c + rot.c * m.s;
  qr.c = rot.c * m.c - rot.s * m.s;
  return qr;
}

Rot.mulVec2 = function(rot, m) {
  _ASSERT && Rot.assert(rot);
  _ASSERT && Vec2.assert(m);
  return Vec2.neo(rot.c * m.x - rot.s * m.y, rot.s * m.x + rot.c * m.y);
}

Rot.mulSub = function(rot, v, w) {
  var x = rot.c * (v.x - w.x) - rot.s * (v.y - w.y);
  var y = rot.s * (v.x - w.x) + rot.c * (v.y - w.y);
  return Vec2.neo(x, y);
}

/**
 * Transpose multiply two rotations: qT * r
 * 
 * @returns Rot
 * 
 * Inverse rotate a vector
 * 
 * @returns Vec2
 */
Rot.mulT = function(rot, m) {
  if ('c' in m && 's' in m) {
    _ASSERT && Rot.assert(m);
    // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
    // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
    // s = qc * rs - qs * rc
    // c = qc * rc + qs * rs
    var qr = Rot.identity();
    qr.s = rot.c * m.s - rot.s * m.c;
    qr.c = rot.c * m.c + rot.s * m.s;
    return qr;

  } else if ('x' in m && 'y' in m) {
    _ASSERT && Vec2.assert(m);
    return Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
  }
}

Rot.mulTRot = function(rot, m) {
  _ASSERT && Rot.assert(m);
  // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
  // [-qs qc] [rs rc] [-qs*rc+qc*rs qs*rs+qc*rc]
  // s = qc * rs - qs * rc
  // c = qc * rc + qs * rs
  var qr = Rot.identity();
  qr.s = rot.c * m.s - rot.s * m.c;
  qr.c = rot.c * m.c + rot.s * m.s;
  return qr;
}

Rot.mulTVec2 = function(rot, m) {
  _ASSERT && Vec2.assert(m);
  return Vec2.neo(rot.c * m.x + rot.s * m.y, -rot.s * m.x + rot.c * m.y);
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Sweep.js":
/*!********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Sweep.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Sweep;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ./Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Transform = __webpack_require__(/*! ./Transform */ "../../node_modules/planck-js/lib/common/Transform.js");

/**
 * This describes the motion of a body/shape for TOI computation. Shapes are
 * defined with respect to the body origin, which may not coincide with the
 * center of mass. However, to support dynamics we must interpolate the center
 * of mass position.
 * 
 * @prop {Vec2} localCenter Local center of mass position
 * @prop {Vec2} c World center position
 * @prop {float} a World angle
 * @prop {float} alpha0 Fraction of the current time step in the range [0,1], c0
 *       and a0 are c and a at alpha0.
 */
function Sweep(c, a) {
  _ASSERT && common.assert(typeof c === 'undefined');
  _ASSERT && common.assert(typeof a === 'undefined');
  this.localCenter = Vec2.zero();
  this.c = Vec2.zero();
  this.a = 0;
  this.alpha0 = 0;
  this.c0 = Vec2.zero();
  this.a0 = 0;
}

Sweep.prototype.setTransform = function(xf) {
  var c = Transform.mulVec2(xf, this.localCenter);
  this.c.set(c);
  this.c0.set(c);

  this.a = xf.q.getAngle();
  this.a0 = xf.q.getAngle();
};

Sweep.prototype.setLocalCenter = function(localCenter, xf) {
  this.localCenter.set(localCenter);

  var c = Transform.mulVec2(xf, this.localCenter);
  this.c.set(c);
  this.c0.set(c);
};

/**
 * Get the interpolated transform at a specific time.
 * 
 * @param xf
 * @param beta A factor in [0,1], where 0 indicates alpha0
 */
Sweep.prototype.getTransform = function(xf, beta) {
  beta = typeof beta === 'undefined' ? 0 : beta;
  xf.q.setAngle((1.0 - beta) * this.a0 + beta * this.a);
  xf.p.setCombine((1.0 - beta), this.c0, beta, this.c);

  // shift to origin
  xf.p.sub(Rot.mulVec2(xf.q, this.localCenter));
};

/**
 * Advance the sweep forward, yielding a new initial state.
 * 
 * @param {float} alpha The new initial time
 */
Sweep.prototype.advance = function(alpha) {
  _ASSERT && common.assert(this.alpha0 < 1.0);
  var beta = (alpha - this.alpha0) / (1.0 - this.alpha0);
  this.c0.setCombine(beta, this.c, 1 - beta, this.c0);
  this.a0 = beta * this.a + (1 - beta) * this.a0;
  this.alpha0 = alpha;
};

Sweep.prototype.forward = function() {
  this.a0 = this.a;
  this.c0.set(this.c);
};

/**
 * normalize the angles in radians to be between -pi and pi.
 */
Sweep.prototype.normalize = function() {
  var a0 = Math.mod(this.a0, -Math.PI, +Math.PI);
  this.a -= this.a0 - a0;
  this.a0 = a0;
};

Sweep.prototype.clone = function() {
  var clone = new Sweep();
  clone.localCenter.set(this.localCenter);
  clone.alpha0 = this.alpha0;
  clone.a0 = this.a0;
  clone.a = this.a;
  clone.c0.set(this.c0);
  clone.c.set(this.c);
  return clone;
};

Sweep.prototype.set = function(that) {
  this.localCenter.set(that.localCenter);
  this.alpha0 = that.alpha0;
  this.a0 = that.a0;
  this.a = that.a;
  this.c0.set(that.c0);
  this.c.set(that.c);
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Transform.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Transform.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Transform;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ./Rot */ "../../node_modules/planck-js/lib/common/Rot.js");

// TODO merge with Rot

/**
 * A transform contains translation and rotation. It is used to represent the
 * position and orientation of rigid frames. Initialize using a position vector
 * and a rotation.
 *
 * @prop {Vec2} position
 * @prop {Rot} rotation
 */
function Transform(position, rotation) {
  if (!(this instanceof Transform)) {
    return new Transform(position, rotation);
  }
  this.p = Vec2.zero();
  this.q = Rot.identity();
  if (typeof position !== 'undefined') {
    this.p.set(position);
  }
  if (typeof rotation !== 'undefined') {
    this.q.set(rotation);
  }
};

Transform.clone = function(xf) {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2.clone(xf.p);
  obj.q = Rot.clone(xf.q);
  return obj;
};

Transform.neo = function(position, rotation) {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2.clone(position);
  obj.q = Rot.clone(rotation);
  return obj;
};

Transform.identity = function() {
  var obj = Object.create(Transform.prototype);
  obj.p = Vec2.zero();
  obj.q = Rot.identity();
  return obj;
};

/**
 * Set this to the identity transform.
 */
Transform.prototype.setIdentity = function() {
  this.p.setZero();
  this.q.setIdentity();
}

/**
 * Set this based on the position and angle.
 */
Transform.prototype.set = function(a, b) {
  if (typeof b === 'undefined') {
    this.p.set(a.p);
    this.q.set(a.q);
  } else {
    this.p.set(a);
    this.q.set(b);
  }
}

Transform.isValid = function(o) {
  return o && Vec2.isValid(o.p) && Rot.isValid(o.q);
}

Transform.assert = function(o) {
  if (!_ASSERT) return;
  if (!Transform.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Transform!');
  }
}

/**
 * @param {Transform} a
 * @param {Vec2} b
 * @returns {Vec2}
 *
 * @param {Transform} a
 * @param {Transform} b
 * @returns {Transform}
 */
Transform.mul = function(a, b) {
  _ASSERT && Transform.assert(a);
  if (Array.isArray(b)) {
    var arr = [];
    for (var i = 0; i < b.length; i++) {
      arr[i] = Transform.mul(a, b[i]);
    }
    return arr;

  } else if ('x' in b && 'y' in b) {
    _ASSERT && Vec2.assert(b);
    var x = (a.q.c * b.x - a.q.s * b.y) + a.p.x;
    var y = (a.q.s * b.x + a.q.c * b.y) + a.p.y;
    return Vec2.neo(x, y);

  } else if ('p' in b && 'q' in b) {
    _ASSERT && Transform.assert(b);
    // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
    // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
    var xf = Transform.identity();
    xf.q = Rot.mulRot(a.q, b.q);
    xf.p = Vec2.add(Rot.mulVec2(a.q, b.p), a.p);
    return xf;
  }
}

/**
 * @deprecated Use mulFn instead.
 */
Transform.mulAll = function(a, b) {
  _ASSERT && Transform.assert(a);
  var arr = [];
  for (var i = 0; i < b.length; i++) {
    arr[i] = Transform.mul(a, b[i]);
  }
  return arr;
}

/**
 * @experimental
 */
Transform.mulFn = function(a) {
  _ASSERT && Transform.assert(a);
  return function(b) {
    return Transform.mul(a, b);
  };
}

Transform.mulVec2 = function(a, b) {
  _ASSERT && Transform.assert(a);
  _ASSERT && Vec2.assert(b);
  var x = (a.q.c * b.x - a.q.s * b.y) + a.p.x;
  var y = (a.q.s * b.x + a.q.c * b.y) + a.p.y;
  return Vec2.neo(x, y);
}

Transform.mulXf = function(a, b) {
  _ASSERT && Transform.assert(a);
  _ASSERT && Transform.assert(b);
  // v2 = A.q.Rot(B.q.Rot(v1) + B.p) + A.p
  // = (A.q * B.q).Rot(v1) + A.q.Rot(B.p) + A.p
  var xf = Transform.identity();
  xf.q = Rot.mulRot(a.q, b.q);
  xf.p = Vec2.add(Rot.mulVec2(a.q, b.p), a.p);
  return xf;
}

/**
 * @param {Transform} a
 * @param {Vec2} b
 * @returns {Vec2}
 *
 * @param {Transform} a
 * @param {Transform} b
 * @returns {Transform}
 */
Transform.mulT = function(a, b) {
  _ASSERT && Transform.assert(a);
  if ('x' in b && 'y' in b) {
    _ASSERT && Vec2.assert(b)
    var px = b.x - a.p.x;
    var py = b.y - a.p.y;
    var x = (a.q.c * px + a.q.s * py);
    var y = (-a.q.s * px + a.q.c * py);
    return Vec2.neo(x, y);

  } else if ('p' in b && 'q' in b) {
    _ASSERT && Transform.assert(b);
    // v2 = A.q' * (B.q * v1 + B.p - A.p)
    // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
    var xf = Transform.identity();
    xf.q.set(Rot.mulTRot(a.q, b.q));
    xf.p.set(Rot.mulTVec2(a.q, Vec2.sub(b.p, a.p)));
    return xf;
  }
}

Transform.mulTVec2 = function(a, b) {
  _ASSERT && Transform.assert(a);
  _ASSERT && Vec2.assert(b)
  var px = b.x - a.p.x;
  var py = b.y - a.p.y;
  var x = (a.q.c * px + a.q.s * py);
  var y = (-a.q.s * px + a.q.c * py);
  return Vec2.neo(x, y);
}

Transform.mulTXf = function(a, b) {
  _ASSERT && Transform.assert(a);
  _ASSERT && Transform.assert(b);
  // v2 = A.q' * (B.q * v1 + B.p - A.p)
  // = A.q' * B.q * v1 + A.q' * (B.p - A.p)
  var xf = Transform.identity();
  xf.q.set(Rot.mulTRot(a.q, b.q));
  xf.p.set(Rot.mulTVec2(a.q, Vec2.sub(b.p, a.p)));
  return xf;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Vec2.js":
/*!*******************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Vec2.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Vec2;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");

function Vec2(x, y) {
  if (!(this instanceof Vec2)) {
    return new Vec2(x, y);
  }
  if (typeof x === 'undefined') {
    this.x = 0;
    this.y = 0;
  } else if (typeof x === 'object') {
    this.x = x.x;
    this.y = x.y;
  } else {
    this.x = x;
    this.y = y;
  }
  _ASSERT && Vec2.assert(this);
}

Vec2.prototype._serialize = function() {
  return {
    x: this.x,
    y: this.y
  };
};

Vec2._deserialize = function(data) {
  var obj = Object.create(Vec2.prototype);
  obj.x = data.x;
  obj.y = data.y;
  return obj;
};

Vec2.zero = function() {
  var obj = Object.create(Vec2.prototype);
  obj.x = 0;
  obj.y = 0;
  return obj;
};

Vec2.neo = function(x, y) {
  var obj = Object.create(Vec2.prototype);
  obj.x = x;
  obj.y = y;
  return obj;
};

Vec2.clone = function(v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(v.x, v.y);
};

Vec2.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * Does this vector contain finite coordinates?
 */
Vec2.isValid = function(v) {
  return v && Math.isFinite(v.x) && Math.isFinite(v.y);
}

Vec2.assert = function(o) {
  if (!_ASSERT) return;
  if (!Vec2.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Vec2!');
  }
}

Vec2.prototype.clone = function() {
  return Vec2.clone(this);
}

/**
 * Set this vector to all zeros.
 * 
 * @returns this
 */
Vec2.prototype.setZero = function() {
  this.x = 0.0;
  this.y = 0.0;
  return this;
}

/**
 * Set this vector to some specified coordinates.
 * 
 * @returns this
 */
Vec2.prototype.set = function(x, y) {
  if (typeof x === 'object') {
    _ASSERT && Vec2.assert(x);
    this.x = x.x;
    this.y = x.y;
  } else {
    _ASSERT && Math.assert(x);
    _ASSERT && Math.assert(y);
    this.x = x;
    this.y = y;
  }
  return this;
}

/**
 * @deprecated Use setCombine or setMul
 */
Vec2.prototype.wSet = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.setCombine(a, v, b, w);
  } else {
    return this.setMul(a, v);
  }
}

/**
 * Set linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.setCombine = function(a, v, b, w) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && Math.assert(b);
  _ASSERT && Vec2.assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x = x;
  this.y = y;
  return this;
}

Vec2.prototype.setMul = function(a, v) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x = x;
  this.y = y;
  return this;
}

/**
 * Add a vector to this vector.
 * 
 * @returns this
 */
Vec2.prototype.add = function(w) {
  _ASSERT && Vec2.assert(w);
  this.x += w.x;
  this.y += w.y;
  return this;
}

/**
 * @deprecated Use addCombine or addMul
 */
Vec2.prototype.wAdd = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.addCombine(a, v, b, w);
  } else {
    return this.addMul(a, v);
  }
}

/**
 * Add linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.addCombine = function(a, v, b, w) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && Math.assert(b);
  _ASSERT && Vec2.assert(w);

  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x += x;
  this.y += y;
  return this;
}

Vec2.prototype.addMul = function(a, v) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x += x;
  this.y += y;
  return this;
}

/**
 * @deprecated Use subCombine or subMul
 */
Vec2.prototype.wSub = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return this.subCombine(a, v, b, w);
  } else {
    return this.subMul(a, v);
  }}

/**
 * Subtract linear combination of v and w: `a * v + b * w`
 */
Vec2.prototype.subCombine = function(a, v, b, w) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  _ASSERT && Math.assert(b);
  _ASSERT && Vec2.assert(w);
  var x = a * v.x + b * w.x;
  var y = a * v.y + b * w.y;

  // `this` may be `w`
  this.x -= x;
  this.y -= y;
  return this;
}

Vec2.prototype.subMul = function(a, v) {
  _ASSERT && Math.assert(a);
  _ASSERT && Vec2.assert(v);
  var x = a * v.x;
  var y = a * v.y;

  this.x -= x;
  this.y -= y;
  return this;
}

/**
 * Subtract a vector from this vector
 * 
 * @returns this
 */
Vec2.prototype.sub = function(w) {
  _ASSERT && Vec2.assert(w);
  this.x -= w.x;
  this.y -= w.y;
  return this;
}

/**
 * Multiply this vector by a scalar.
 * 
 * @returns this
 */
Vec2.prototype.mul = function(m) {
  _ASSERT && Math.assert(m);
  this.x *= m;
  this.y *= m;
  return this;
}

/**
 * Get the length of this vector (the norm).
 * 
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2.prototype.length = function() {
  return Vec2.lengthOf(this);
}

/**
 * Get the length squared.
 */
Vec2.prototype.lengthSquared = function() {
  return Vec2.lengthSquared(this);
}

/**
 * Convert this vector into a unit vector.
 * 
 * @returns old length
 */
Vec2.prototype.normalize = function() {
  var length = this.length();
  if (length < Math.EPSILON) {
    return 0.0;
  }
  var invLength = 1.0 / length;
  this.x *= invLength;
  this.y *= invLength;
  return length;
}

/**
 * Get the length of this vector (the norm).
 *
 * For performance, use this instead of lengthSquared (if possible).
 */
Vec2.lengthOf = function(v) {
  _ASSERT && Vec2.assert(v);
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Get the length squared.
 */
Vec2.lengthSquared = function(v) {
  _ASSERT && Vec2.assert(v);
  return v.x * v.x + v.y * v.y;
}

Vec2.distance = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  var dx = v.x - w.x, dy = v.y - w.y;
  return Math.sqrt(dx * dx + dy * dy);
}

Vec2.distanceSquared = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  var dx = v.x - w.x, dy = v.y - w.y;
  return dx * dx + dy * dy;
}

Vec2.areEqual = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return v == w || typeof w === 'object' && w !== null && v.x === w.x && v.y === w.y;
}

/**
 * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
 */
Vec2.skew = function(v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(-v.y, v.x);
}

/**
 * Perform the dot product on two vectors.
 */
Vec2.dot = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return v.x * w.x + v.y * w.y;
}

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 * 
 * Perform the cross product on a vector and a scalar. In 2D this produces a
 * vector.
 */
Vec2.cross = function(v, w) {
  if (typeof w === 'number') {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Math.assert(w);
    return Vec2.neo(w * v.y, -w * v.x);

  } else if (typeof v === 'number') {
    _ASSERT && Math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y, v * w.x);

  } else {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Vec2.assert(w);
    return v.x * w.y - v.y * w.x
  }
}

/**
 * Returns `a + (v x w)`
 */
Vec2.addCross = function(a, v, w) {
  if (typeof w === 'number') {
    _ASSERT && Vec2.assert(v);
    _ASSERT && Math.assert(w);
    return Vec2.neo(w * v.y + a.x, -w * v.x + a.y);

  } else if (typeof v === 'number') {
    _ASSERT && Math.assert(v);
    _ASSERT && Vec2.assert(w);
    return Vec2.neo(-v * w.y + a.x, v * w.x + a.y);
  }

  _ASSERT && common.assert(false);
}

Vec2.add = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(v.x + w.x, v.y + w.y);
}

/**
 * @deprecated Use combine
 */
Vec2.wAdd = function(a, v, b, w) {
  if (typeof b !== 'undefined' || typeof w !== 'undefined') {
    return Vec2.combine(a, v, b, w);
  } else {
    return Vec2.mul(a, v);
  }
}

Vec2.combine = function(a, v, b, w) {
  return Vec2.zero().setCombine(a, v, b, w);
}

Vec2.sub = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(v.x - w.x, v.y - w.y);
}

Vec2.mul = function(a, b) {
  if (typeof a === 'object') {
    _ASSERT && Vec2.assert(a);
    _ASSERT && Math.assert(b);
    return Vec2.neo(a.x * b, a.y * b);

  } else if (typeof b === 'object') {
    _ASSERT && Math.assert(a);
    _ASSERT && Vec2.assert(b);
    return Vec2.neo(a * b.x, a * b.y);
  }
}

Vec2.prototype.neg = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
}

Vec2.neg = function(v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(-v.x, -v.y);
}

Vec2.abs = function(v) {
  _ASSERT && Vec2.assert(v);
  return Vec2.neo(Math.abs(v.x), Math.abs(v.y));
}

Vec2.mid = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo((v.x + w.x) * 0.5, (v.y + w.y) * 0.5);
}

Vec2.upper = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(Math.max(v.x, w.x), Math.max(v.y, w.y));
}

Vec2.lower = function(v, w) {
  _ASSERT && Vec2.assert(v);
  _ASSERT && Vec2.assert(w);
  return Vec2.neo(Math.min(v.x, w.x), Math.min(v.y, w.y));
}

Vec2.prototype.clamp = function(max) {
  var lengthSqr = this.x * this.x + this.y * this.y;
  if (lengthSqr > max * max) {
    var invLength = Math.invSqrt(lengthSqr);
    this.x *= invLength * max;
    this.y *= invLength * max;
  }
  return this;
}

Vec2.clamp = function(v, max) {
  v = Vec2.neo(v.x, v.y);
  v.clamp(max);
  return v;
}

/**
 * @experimental
 */
Vec2.scaleFn = function (x, y) {
  return function (v) {
    return Vec2.neo(v.x * x, v.y * y);
  };
}

/**
 * @experimental
 */
Vec2.translateFn = function(x, y) {
  return function (v) {
    return Vec2.neo(v.x + x, v.y + y);
  };
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Vec3.js":
/*!*******************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Vec3.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Vec3;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ./Math */ "../../node_modules/planck-js/lib/common/Math.js");

function Vec3(x, y, z) {
  if (!(this instanceof Vec3)) {
    return new Vec3(x, y, z);
  }
  if (typeof x === 'undefined') {
    this.x = 0, this.y = 0, this.z = 0;
  } else if (typeof x === 'object') {
    this.x = x.x, this.y = x.y, this.z = x.z;
  } else {
    this.x = x, this.y = y, this.z = z;
  }
  _ASSERT && Vec3.assert(this);
};

Vec3.prototype._serialize = function() {
  return {
    x: this.x,
    y: this.y,
    z: this.z
  };
};

Vec3._deserialize = function(data) {
  var obj = Object.create(Vec3.prototype);
  obj.x = data.x;
  obj.y = data.y;
  obj.z = data.z;
  return obj;
};

Vec3.neo = function(x, y, z) {
  var obj = Object.create(Vec3.prototype);
  obj.x = x;
  obj.y = y;
  obj.z = z;
  return obj;
};

Vec3.clone = function(v) {
  _ASSERT && Vec3.assert(v);
  return Vec3.neo(v.x, v.y, v.z);
};

Vec3.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * Does this vector contain finite coordinates?
 */
Vec3.isValid = function(v) {
  return v && Math.isFinite(v.x) && Math.isFinite(v.y) && Math.isFinite(v.z);
}

Vec3.assert = function(o) {
  if (!_ASSERT) return;
  if (!Vec3.isValid(o)) {
    _DEBUG && common.debug(o);
    throw new Error('Invalid Vec3!');
  }
}

Vec3.prototype.setZero = function() {
  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  return this;
}

Vec3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
}

Vec3.prototype.add = function(w) {
  this.x += w.x;
  this.y += w.y;
  this.z += w.z;
  return this;
}

Vec3.prototype.sub = function(w) {
  this.x -= w.x;
  this.y -= w.y;
  this.z -= w.z;
  return this;
}

Vec3.prototype.mul = function(m) {
  this.x *= m;
  this.y *= m;
  this.z *= m;
  return this;
}

Vec3.areEqual = function(v, w) {
  _ASSERT && Vec3.assert(v);
  _ASSERT && Vec3.assert(w);
  return v == w ||
    typeof v === 'object' && v !== null &&
    typeof w === 'object' && w !== null &&
    v.x === w.x && v.y === w.y && v.z === w.z;
}

/**
 * Perform the dot product on two vectors.
 */
Vec3.dot = function(v, w) {
  return v.x * w.x + v.y * w.y + v.z * w.z;
}

/**
 * Perform the cross product on two vectors. In 2D this produces a scalar.
 */
Vec3.cross = function(v, w) {
  return new Vec3(
    v.y * w.z - v.z * w.y,
    v.z * w.x - v.x * w.z,
    v.x * w.y - v.y * w.x
  );
}

Vec3.add = function(v, w) {
  return new Vec3(v.x + w.x, v.y + w.y, v.z + w.z);
}

Vec3.sub = function(v, w) {
  return new Vec3(v.x - w.x, v.y - w.y, v.z - w.z);
}

Vec3.mul = function(v, m) {
  return new Vec3(m * v.x, m * v.y, m * v.z);
}

Vec3.prototype.neg = function() {
  this.x = -this.x;
  this.y = -this.y;
  this.z = -this.z;
  return this;
}

Vec3.neg = function(v) {
  return new Vec3(-v.x, -v.y, -v.z);
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/Velocity.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/Velocity.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Velocity;

var Vec2 = __webpack_require__(/*! ./Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");

/**
 * @prop {Vec2} v linear
 * @prop {float} w angular
 */
function Velocity() {
  this.v = Vec2.zero();
  this.w = 0;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/common/stats.js":
/*!********************************************************!*\
  !*** ../../node_modules/planck-js/lib/common/stats.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.toString = function(newline) {
  newline = typeof newline === 'string' ? newline : '\n';
  var string = "";
  for (var name in this) {
    if (typeof this[name] !== 'function' && typeof this[name] !== 'object') {
      string += name + ': ' + this[name] + newline;
    }
  }
  return string;
};

/***/ }),

/***/ "../../node_modules/planck-js/lib/index.js":
/*!*************************************************!*\
  !*** ../../node_modules/planck-js/lib/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.internal = {};

exports.Serializer = __webpack_require__(/*! ./serializer */ "../../node_modules/planck-js/lib/serializer/index.js");

exports.Math = __webpack_require__(/*! ./common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
exports.Vec2 = __webpack_require__(/*! ./common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
exports.Vec3 = __webpack_require__(/*! ./common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
exports.Mat22 = __webpack_require__(/*! ./common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
exports.Mat33 = __webpack_require__(/*! ./common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
exports.Transform = __webpack_require__(/*! ./common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
exports.Rot = __webpack_require__(/*! ./common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");

exports.AABB = __webpack_require__(/*! ./collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");

exports.Shape = __webpack_require__(/*! ./Shape */ "../../node_modules/planck-js/lib/Shape.js");
exports.Fixture = __webpack_require__(/*! ./Fixture */ "../../node_modules/planck-js/lib/Fixture.js");
exports.Body = __webpack_require__(/*! ./Body */ "../../node_modules/planck-js/lib/Body.js");
exports.Contact = __webpack_require__(/*! ./Contact */ "../../node_modules/planck-js/lib/Contact.js");
exports.Joint = __webpack_require__(/*! ./Joint */ "../../node_modules/planck-js/lib/Joint.js");
exports.World = __webpack_require__(/*! ./World */ "../../node_modules/planck-js/lib/World.js");

exports.Circle = __webpack_require__(/*! ./shape/CircleShape */ "../../node_modules/planck-js/lib/shape/CircleShape.js");
exports.Edge = __webpack_require__(/*! ./shape/EdgeShape */ "../../node_modules/planck-js/lib/shape/EdgeShape.js");
exports.Polygon = __webpack_require__(/*! ./shape/PolygonShape */ "../../node_modules/planck-js/lib/shape/PolygonShape.js");
exports.Chain = __webpack_require__(/*! ./shape/ChainShape */ "../../node_modules/planck-js/lib/shape/ChainShape.js");
exports.Box = __webpack_require__(/*! ./shape/BoxShape */ "../../node_modules/planck-js/lib/shape/BoxShape.js");

__webpack_require__(/*! ./shape/CollideCircle */ "../../node_modules/planck-js/lib/shape/CollideCircle.js");
__webpack_require__(/*! ./shape/CollideEdgeCircle */ "../../node_modules/planck-js/lib/shape/CollideEdgeCircle.js");
exports.internal.CollidePolygons = __webpack_require__(/*! ./shape/CollidePolygon */ "../../node_modules/planck-js/lib/shape/CollidePolygon.js");
__webpack_require__(/*! ./shape/CollideCirclePolygone */ "../../node_modules/planck-js/lib/shape/CollideCirclePolygone.js");
__webpack_require__(/*! ./shape/CollideEdgePolygon */ "../../node_modules/planck-js/lib/shape/CollideEdgePolygon.js");

exports.DistanceJoint = __webpack_require__(/*! ./joint/DistanceJoint */ "../../node_modules/planck-js/lib/joint/DistanceJoint.js");
exports.FrictionJoint = __webpack_require__(/*! ./joint/FrictionJoint */ "../../node_modules/planck-js/lib/joint/FrictionJoint.js");
exports.GearJoint = __webpack_require__(/*! ./joint/GearJoint */ "../../node_modules/planck-js/lib/joint/GearJoint.js");
exports.MotorJoint = __webpack_require__(/*! ./joint/MotorJoint */ "../../node_modules/planck-js/lib/joint/MotorJoint.js");
exports.MouseJoint = __webpack_require__(/*! ./joint/MouseJoint */ "../../node_modules/planck-js/lib/joint/MouseJoint.js");
exports.PrismaticJoint = __webpack_require__(/*! ./joint/PrismaticJoint */ "../../node_modules/planck-js/lib/joint/PrismaticJoint.js");
exports.PulleyJoint = __webpack_require__(/*! ./joint/PulleyJoint */ "../../node_modules/planck-js/lib/joint/PulleyJoint.js");
exports.RevoluteJoint = __webpack_require__(/*! ./joint/RevoluteJoint */ "../../node_modules/planck-js/lib/joint/RevoluteJoint.js");
exports.RopeJoint = __webpack_require__(/*! ./joint/RopeJoint */ "../../node_modules/planck-js/lib/joint/RopeJoint.js");
exports.WeldJoint = __webpack_require__(/*! ./joint/WeldJoint */ "../../node_modules/planck-js/lib/joint/WeldJoint.js");
exports.WheelJoint = __webpack_require__(/*! ./joint/WheelJoint */ "../../node_modules/planck-js/lib/joint/WheelJoint.js");

exports.Settings = __webpack_require__(/*! ./Settings */ "../../node_modules/planck-js/lib/Settings.js");

exports.internal.Sweep = __webpack_require__(/*! ./common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
exports.internal.stats = __webpack_require__(/*! ./common/stats */ "../../node_modules/planck-js/lib/common/stats.js"); // todo: remove this
exports.internal.Manifold = __webpack_require__(/*! ./Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
exports.internal.Distance = __webpack_require__(/*! ./collision/Distance */ "../../node_modules/planck-js/lib/collision/Distance.js");
exports.internal.TimeOfImpact = __webpack_require__(/*! ./collision/TimeOfImpact */ "../../node_modules/planck-js/lib/collision/TimeOfImpact.js");
exports.internal.DynamicTree = __webpack_require__(/*! ./collision/DynamicTree */ "../../node_modules/planck-js/lib/collision/DynamicTree.js");
exports.internal.Settings = exports.Settings;


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/DistanceJoint.js":
/*!***************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/DistanceJoint.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = DistanceJoint;

var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

DistanceJoint.TYPE = 'distance-joint';
Joint.TYPES[DistanceJoint.TYPE] = DistanceJoint;

DistanceJoint._super = Joint;
DistanceJoint.prototype = Object.create(DistanceJoint._super.prototype);

/**
 * @typedef {Object} DistanceJointDef
 *
 * Distance joint definition. This requires defining an anchor point on both
 * bodies and the non-zero length of the distance joint. The definition uses
 * local anchor points so that the initial configuration can violate the
 * constraint slightly. This helps when saving and loading a game. Warning: Do
 * not use a zero or short length.
 * 
 * @prop {float} frequencyHz The mass-spring-damper frequency in Hertz. A value
 *       of 0 disables softness.
 * @prop {float} dampingRatio The damping ratio. 0 = no damping, 1 = critical
 *       damping.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {number} length Distance length.
 */

var DEFAULTS = {
  frequencyHz : 0.0,
  dampingRatio : 0.0
};

/**
 * A distance joint constrains two points on two bodies to remain at a fixed
 * distance from each other. You can view this as a massless, rigid rod.
 *
 * @param {DistanceJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec2} anchorA Anchor A in global coordination.
 * @param {Vec2} anchorB Anchor B in global coordination.
 */
function DistanceJoint(def, bodyA, bodyB, anchorA, anchorB) {
  if (!(this instanceof DistanceJoint)) {
    return new DistanceJoint(def, bodyA, bodyB, anchorA, anchorB);
  }

  // order of constructor arguments is changed in v0.2
  if (bodyB && anchorA && ('m_type' in anchorA) && ('x' in bodyB) && ('y' in bodyB)) {
    var temp = bodyB;
    bodyB = anchorA;
    anchorA = temp;
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = DistanceJoint.TYPE;

  // Solver shared
  this.m_localAnchorA = Vec2.clone(anchorA ? bodyA.getLocalPoint(anchorA) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB = Vec2.clone(anchorB ? bodyB.getLocalPoint(anchorB) : def.localAnchorB || Vec2.zero());
  this.m_length = Math.isFinite(def.length) ? def.length :
    Vec2.distance(bodyA.getWorldPoint(this.m_localAnchorA), bodyB.getWorldPoint(this.m_localAnchorB));
  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;
  this.m_impulse = 0.0;
  this.m_gamma = 0.0;
  this.m_bias = 0.0;

  // Solver temp
  this.m_u; // Vec2
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA;
  this.m_invMassB;
  this.m_invIA;
  this.m_invIB;
  this.m_mass;

  // 1-D constrained system
  // m (v2 - v1) = lambda
  // v2 + (beta/h) * x1 + gamma * lambda = 0, gamma has units of inverse mass.
  // x2 = x1 + h * v2

  // 1-D mass-damper-spring system
  // m (v2 - v1) + h * d * v2 + h * k *

  // C = norm(p2 - p1) - L
  // u = (p2 - p1) / norm(p2 - p1)
  // Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
  // J = [-u -cross(r1, u) u cross(r2, u)]
  // K = J * invM * JT
  // = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2
};

DistanceJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    frequencyHz: this.m_frequencyHz,
    dampingRatio: this.m_dampingRatio,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    length: this.m_length,

    impulse: this.m_impulse,
    gamma: this.m_gamma,
    bias: this.m_bias,
  };
};

DistanceJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new DistanceJoint(data);
  return joint;
};

/**
 * @internal
 */
DistanceJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }

  if (def.length > 0) {
    this.m_length = +def.length;
  } else if (def.length < 0) { // don't change length
  } else if (def.anchorA || def.anchorA || def.anchorA || def.anchorA) {
    this.m_length = Vec2.distance(
        this.m_bodyA.getWorldPoint(this.m_localAnchorA),
        this.m_bodyB.getWorldPoint(this.m_localAnchorB)
    );
  }
}

/**
 * The local anchor point relative to bodyA's origin.
 */
DistanceJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
DistanceJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * Set/get the natural length. Manipulating the length can lead to non-physical
 * behavior when the frequency is zero.
 */
DistanceJoint.prototype.setLength = function(length) {
  this.m_length = length;
}

DistanceJoint.prototype.getLength = function() {
  return this.m_length;
}

DistanceJoint.prototype.setFrequency = function(hz) {
  this.m_frequencyHz = hz;
}

DistanceJoint.prototype.getFrequency = function() {
  return this.m_frequencyHz;
}

DistanceJoint.prototype.setDampingRatio = function(ratio) {
  this.m_dampingRatio = ratio;
}

DistanceJoint.prototype.getDampingRatio = function() {
  return this.m_dampingRatio;
}

DistanceJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

DistanceJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

DistanceJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(this.m_impulse, this.m_u).mul(inv_dt);
}

DistanceJoint.prototype.getReactionTorque = function(inv_dt) {
  return 0.0;
}

DistanceJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  this.m_rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));
  this.m_u = Vec2.sub(Vec2.add(cB, this.m_rB), Vec2.add(cA, this.m_rA));

  // Handle singularity.
  var length = this.m_u.length();
  if (length > Settings.linearSlop) {
    this.m_u.mul(1.0 / length);
  } else {
    this.m_u.set(0.0, 0.0);
  }

  var crAu = Vec2.cross(this.m_rA, this.m_u);
  var crBu = Vec2.cross(this.m_rB, this.m_u);
  var invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB
      + this.m_invIB * crBu * crBu;

  // Compute the effective mass matrix.
  this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;

  if (this.m_frequencyHz > 0.0) {
    var C = length - this.m_length;

    // Frequency
    var omega = 2.0 * Math.PI * this.m_frequencyHz;

    // Damping coefficient
    var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;

    // Spring stiffness
    var k = this.m_mass * omega * omega;

    // magic formulas
    var h = step.dt;
    this.m_gamma = h * (d + h * k);
    this.m_gamma = this.m_gamma != 0.0 ? 1.0 / this.m_gamma : 0.0;
    this.m_bias = C * h * k * this.m_gamma;

    invMass += this.m_gamma;
    this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
  } else {
    this.m_gamma = 0.0;
    this.m_bias = 0.0;
  }

  if (step.warmStarting) {
    // Scale the impulse to support a variable time step.
    this.m_impulse *= step.dtRatio;

    var P = Vec2.mul(this.m_impulse, this.m_u);

    vA.subMul(this.m_invMassA, P);
    wA -= this.m_invIA * Vec2.cross(this.m_rA, P);

    vB.addMul(this.m_invMassB, P);
    wB += this.m_invIB * Vec2.cross(this.m_rB, P);

  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

DistanceJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  // Cdot = dot(u, v + cross(w, r))
  var vpA = Vec2.add(vA, Vec2.cross(wA, this.m_rA));
  var vpB = Vec2.add(vB, Vec2.cross(wB, this.m_rB));
  var Cdot = Vec2.dot(this.m_u, vpB) - Vec2.dot(this.m_u, vpA);

  var impulse = -this.m_mass
      * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
  this.m_impulse += impulse;

  var P = Vec2.mul(impulse, this.m_u);
  vA.subMul(this.m_invMassA, P);
  wA -= this.m_invIA * Vec2.cross(this.m_rA, P);
  vB.addMul(this.m_invMassB, P);
  wB += this.m_invIB * Vec2.cross(this.m_rB, P);

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

DistanceJoint.prototype.solvePositionConstraints = function(step) {
  if (this.m_frequencyHz > 0.0) {
    // There is no position correction for soft distance constraints.
    return true;
  }

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  var rA = Rot.mulSub(qA, this.m_localAnchorA, this.m_localCenterA);
  var rB = Rot.mulSub(qB, this.m_localAnchorB, this.m_localCenterB);
  var u = Vec2.sub(Vec2.add(cB, rB), Vec2.add(cA, rA));

  var length = u.normalize();
  var C = length - this.m_length;
  C = Math
      .clamp(C, -Settings.maxLinearCorrection, Settings.maxLinearCorrection);

  var impulse = -this.m_mass * C;
  var P = Vec2.mul(impulse, u);

  cA.subMul(this.m_invMassA, P);
  aA -= this.m_invIA * Vec2.cross(rA, P);
  cB.addMul(this.m_invMassB, P);
  aB += this.m_invIB * Vec2.cross(rB, P);

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;

  return Math.abs(C) < Settings.linearSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/FrictionJoint.js":
/*!***************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/FrictionJoint.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = FrictionJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

FrictionJoint.TYPE = 'friction-joint';
Joint.TYPES[FrictionJoint.TYPE] = FrictionJoint;

FrictionJoint._super = Joint;
FrictionJoint.prototype = Object.create(FrictionJoint._super.prototype);

/**
 * @typedef {Object} FrictionJointDef
 *
 * Friction joint definition.
 * 
 * @prop {float} maxForce The maximum friction force in N.
 * @prop {float} maxTorque The maximum friction torque in N-m.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 */

var DEFAULTS = {
  maxForce : 0.0,
  maxTorque : 0.0,
};

/**
 * Friction joint. This is used for top-down friction. It provides 2D
 * translational friction and angular friction.
 *
 * @param {FrictionJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {Vec2} anchor Anchor in global coordination.
 */
function FrictionJoint(def, bodyA, bodyB, anchor) {
  if (!(this instanceof FrictionJoint)) {
    return new FrictionJoint(def, bodyA, bodyB, anchor);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = FrictionJoint.TYPE;

  this.m_localAnchorA = Vec2.clone(anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB = Vec2.clone(anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.zero());

  // Solver shared
  this.m_linearImpulse = Vec2.zero();
  this.m_angularImpulse = 0.0;
  this.m_maxForce = def.maxForce;
  this.m_maxTorque = def.maxTorque;

  // Solver temp
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_linearMass; // Mat22
  this.m_angularMass; // float

  // Point-to-point constraint
  // Cdot = v2 - v1
  // = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)

  // Angle constraint
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
}

FrictionJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    maxForce: this.m_maxForce,
    maxTorque: this.m_maxTorque,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
  };
};

FrictionJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new FrictionJoint(data);
  return joint;
};

/**
 * @internal
 */
FrictionJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }
}


/**
 * The local anchor point relative to bodyA's origin.
 */
FrictionJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
FrictionJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * Set the maximum friction force in N.
 */
FrictionJoint.prototype.setMaxForce = function(force) {
  _ASSERT && common.assert(Math.isFinite(force) && force >= 0.0);
  this.m_maxForce = force;
}

/**
 * Get the maximum friction force in N.
 */
FrictionJoint.prototype.getMaxForce = function() {
  return this.m_maxForce;
}

/**
 * Set the maximum friction torque in N*m.
 */
FrictionJoint.prototype.setMaxTorque = function(torque) {
  _ASSERT && common.assert(Math.isFinite(torque) && torque >= 0.0);
  this.m_maxTorque = torque;
}

/**
 * Get the maximum friction torque in N*m.
 */
FrictionJoint.prototype.getMaxTorque = function() {
  return this.m_maxTorque;
}

FrictionJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

FrictionJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

FrictionJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(inv_dt, this.m_linearImpulse);
}

FrictionJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_angularImpulse;
}

FrictionJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA), qB = Rot.neo(aB);

  // Compute the effective mass matrix.
  this.m_rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // J = [-I -r1_skew I r2_skew]
  // [ 0 -1 0 1]
  // r_skew = [-ry; rx]

  // Matlab
  // K = [ mA+r1y^2*iA+mB+r2y^2*iB, -r1y*iA*r1x-r2y*iB*r2x, -r1y*iA-r2y*iB]
  // [ -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB, r1x*iA+r2x*iB]
  // [ -r1y*iA-r2y*iB, r1x*iA+r2x*iB, iA+iB]

  var mA = this.m_invMassA, mB = this.m_invMassB; // float
  var iA = this.m_invIA, iB = this.m_invIB; // float

  var K = new Mat22()
  K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y
      * this.m_rB.y;
  K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
  K.ey.x = K.ex.y;
  K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x
      * this.m_rB.x;

  this.m_linearMass = K.getInverse();

  this.m_angularMass = iA + iB;
  if (this.m_angularMass > 0.0) {
    this.m_angularMass = 1.0 / this.m_angularMass;
  }

  if (step.warmStarting) {
    // Scale impulses to support a variable time step.
    this.m_linearImpulse.mul(step.dtRatio);
    this.m_angularImpulse *= step.dtRatio;

    var P = Vec2.neo(this.m_linearImpulse.x, this.m_linearImpulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + this.m_angularImpulse);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + this.m_angularImpulse);

  } else {
    this.m_linearImpulse.setZero();
    this.m_angularImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

FrictionJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA, mB = this.m_invMassB; // float
  var iA = this.m_invIA, iB = this.m_invIB; // float

  var h = step.dt; // float

  // Solve angular friction
  {
    var Cdot = wB - wA; // float
    var impulse = -this.m_angularMass * Cdot; // float

    var oldImpulse = this.m_angularImpulse; // float
    var maxImpulse = h * this.m_maxTorque; // float
    this.m_angularImpulse = Math.clamp(this.m_angularImpulse + impulse,
        -maxImpulse, maxImpulse);
    impulse = this.m_angularImpulse - oldImpulse;

    wA -= iA * impulse;
    wB += iB * impulse;
  }

  // Solve linear friction
  {
    var Cdot = Vec2.sub(Vec2.add(vB, Vec2.cross(wB, this.m_rB)), Vec2.add(vA,
        Vec2.cross(wA, this.m_rA))); // Vec2

    var impulse = Vec2.neg(Mat22.mulVec2(this.m_linearMass, Cdot)); // Vec2
    var oldImpulse = this.m_linearImpulse; // Vec2
    this.m_linearImpulse.add(impulse);

    var maxImpulse = h * this.m_maxForce; // float

    if (this.m_linearImpulse.lengthSquared() > maxImpulse * maxImpulse) {
      this.m_linearImpulse.normalize();
      this.m_linearImpulse.mul(maxImpulse);
    }

    impulse = Vec2.sub(this.m_linearImpulse, oldImpulse);

    vA.subMul(mA, impulse);
    wA -= iA * Vec2.cross(this.m_rA, impulse);

    vB.addMul(mB, impulse);
    wB += iB * Vec2.cross(this.m_rB, impulse);
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

FrictionJoint.prototype.solvePositionConstraints = function(step) {
  return true;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/GearJoint.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/GearJoint.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = GearJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

var RevoluteJoint = __webpack_require__(/*! ./RevoluteJoint */ "../../node_modules/planck-js/lib/joint/RevoluteJoint.js");
var PrismaticJoint = __webpack_require__(/*! ./PrismaticJoint */ "../../node_modules/planck-js/lib/joint/PrismaticJoint.js");

GearJoint.TYPE = 'gear-joint';
Joint.TYPES[GearJoint.TYPE] = GearJoint;

GearJoint._super = Joint;
GearJoint.prototype = Object.create(GearJoint._super.prototype);

/**
 * @typedef {Object} GearJointDef
 *
 * Gear joint definition.
 *
 * @prop {float} ratio The gear ratio. See GearJoint for explanation.
 *
 * @prop {RevoluteJoint|PrismaticJoint} joint1 The first revolute/prismatic
 *          joint attached to the gear joint.
 * @prop {PrismaticJoint|RevoluteJoint} joint2 The second prismatic/revolute
 *          joint attached to the gear joint.
 */

var DEFAULTS = {
  ratio : 1.0
};

/**
 * A gear joint is used to connect two joints together. Either joint can be a
 * revolute or prismatic joint. You specify a gear ratio to bind the motions
 * together: coordinate1 + ratio * coordinate2 = constant
 * 
 * The ratio can be negative or positive. If one joint is a revolute joint and
 * the other joint is a prismatic joint, then the ratio will have units of
 * length or units of 1/length. Warning: You have to manually destroy the gear
 * joint if joint1 or joint2 is destroyed.
 * 
 * This definition requires two existing revolute or prismatic joints (any
 * combination will work).
 *
 * @param {GearJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function GearJoint(def, bodyA, bodyB, joint1, joint2, ratio) {
  if (!(this instanceof GearJoint)) {
    return new GearJoint(def, bodyA, bodyB, joint1, joint2, ratio);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = GearJoint.TYPE;

  _ASSERT && common.assert(joint1.m_type === RevoluteJoint.TYPE
      || joint1.m_type === PrismaticJoint.TYPE);
  _ASSERT && common.assert(joint2.m_type === RevoluteJoint.TYPE
      || joint2.m_type === PrismaticJoint.TYPE);

  this.m_joint1 = joint1 ? joint1 : def.joint1;
  this.m_joint2 = joint2 ? joint2 : def.joint2;
  this.m_ratio = Math.isFinite(ratio) ? ratio : def.ratio;

  this.m_type1 = this.m_joint1.getType();
  this.m_type2 = this.m_joint2.getType();

  // joint1 connects body A to body C
  // joint2 connects body B to body D

  var coordinateA, coordinateB; // float

  // TODO_ERIN there might be some problem with the joint edges in Joint.

  this.m_bodyC = this.m_joint1.getBodyA();
  this.m_bodyA = this.m_joint1.getBodyB();

  // Get geometry of joint1
  var xfA = this.m_bodyA.m_xf;
  var aA = this.m_bodyA.m_sweep.a;
  var xfC = this.m_bodyC.m_xf;
  var aC = this.m_bodyC.m_sweep.a;

  if (this.m_type1 === RevoluteJoint.TYPE) {
    var revolute = this.m_joint1;// RevoluteJoint
    this.m_localAnchorC = revolute.m_localAnchorA;
    this.m_localAnchorA = revolute.m_localAnchorB;
    this.m_referenceAngleA = revolute.m_referenceAngle;
    this.m_localAxisC = Vec2.zero();

    coordinateA = aA - aC - this.m_referenceAngleA;
  } else {
    var prismatic = this.m_joint1; // PrismaticJoint
    this.m_localAnchorC = prismatic.m_localAnchorA;
    this.m_localAnchorA = prismatic.m_localAnchorB;
    this.m_referenceAngleA = prismatic.m_referenceAngle;
    this.m_localAxisC = prismatic.m_localXAxisA;

    var pC = this.m_localAnchorC;
    var pA = Rot.mulTVec2(xfC.q, Vec2.add(Rot.mul(xfA.q, this.m_localAnchorA), Vec2.sub(xfA.p, xfC.p)));
    coordinateA = Vec2.dot(pA, this.m_localAxisC) - Vec2.dot(pC, this.m_localAxisC);
  }

  this.m_bodyD = this.m_joint2.getBodyA();
  this.m_bodyB = this.m_joint2.getBodyB();

  // Get geometry of joint2
  var xfB = this.m_bodyB.m_xf;
  var aB = this.m_bodyB.m_sweep.a;
  var xfD = this.m_bodyD.m_xf;
  var aD = this.m_bodyD.m_sweep.a;

  if (this.m_type2 === RevoluteJoint.TYPE) {
    var revolute = this.m_joint2; // RevoluteJoint
    this.m_localAnchorD = revolute.m_localAnchorA;
    this.m_localAnchorB = revolute.m_localAnchorB;
    this.m_referenceAngleB = revolute.m_referenceAngle;
    this.m_localAxisD = Vec2.zero();

    coordinateB = aB - aD - this.m_referenceAngleB;
  } else {
    var prismatic = this.m_joint2; // PrismaticJoint
    this.m_localAnchorD = prismatic.m_localAnchorA;
    this.m_localAnchorB = prismatic.m_localAnchorB;
    this.m_referenceAngleB = prismatic.m_referenceAngle;
    this.m_localAxisD = prismatic.m_localXAxisA;

    var pD = this.m_localAnchorD;
    var pB = Rot.mulTVec2(xfD.q, Vec2.add(Rot.mul(xfB.q, this.m_localAnchorB), Vec2.sub(xfB.p, xfD.p)));
    coordinateB = Vec2.dot(pB, this.m_localAxisD) - Vec2.dot(pD, this.m_localAxisD);
  }

  this.m_constant = coordinateA + this.m_ratio * coordinateB;

  this.m_impulse = 0.0;

  // Solver temp
  this.m_lcA, this.m_lcB, this.m_lcC, this.m_lcD; // Vec2
  this.m_mA, this.m_mB, this.m_mC, this.m_mD; // float
  this.m_iA, this.m_iB, this.m_iC, this.m_iD; // float
  this.m_JvAC, this.m_JvBD; // Vec2
  this.m_JwA, this.m_JwB, this.m_JwC, this.m_JwD; // float
  this.m_mass; // float

  // Gear Joint:
  // C0 = (coordinate1 + ratio * coordinate2)_initial
  // C = (coordinate1 + ratio * coordinate2) - C0 = 0
  // J = [J1 ratio * J2]
  // K = J * invM * JT
  // = J1 * invM1 * J1T + ratio * ratio * J2 * invM2 * J2T
  //
  // Revolute:
  // coordinate = rotation
  // Cdot = angularVelocity
  // J = [0 0 1]
  // K = J * invM * JT = invI
  //
  // Prismatic:
  // coordinate = dot(p - pg, ug)
  // Cdot = dot(v + cross(w, r), ug)
  // J = [ug cross(r, ug)]
  // K = J * invM * JT = invMass + invI * cross(r, ug)^2
};

GearJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    joint1: this.m_joint1,
    joint2: this.m_joint2,
    ratio: this.m_ratio,

    // _constant: this.m_constant,
  };
};

GearJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  data.joint1 = restore(Joint, data.joint1, world);
  data.joint2 = restore(Joint, data.joint2, world);
  var joint = new GearJoint(data);
  // if (data._constant) joint.m_constant = data._constant;
  return joint;
};

/**
 * Get the first joint.
 */
GearJoint.prototype.getJoint1 = function() {
  return this.m_joint1;
}

/**
 * Get the second joint.
 */
GearJoint.prototype.getJoint2 = function() {
  return this.m_joint2;
}

/**
 * Set/Get the gear ratio.
 */
GearJoint.prototype.setRatio = function(ratio) {
  _ASSERT && common.assert(Math.isFinite(ratio));
  this.m_ratio = ratio;
}

GearJoint.prototype.getRatio = function() {
  return this.m_ratio;
}

GearJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

GearJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

GearJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(this.m_impulse, this.m_JvAC).mul(inv_dt);
}

GearJoint.prototype.getReactionTorque = function(inv_dt) {
  var L = this.m_impulse * this.m_JwA; // float
  return inv_dt * L;
}

GearJoint.prototype.initVelocityConstraints = function(step) {
  this.m_lcA = this.m_bodyA.m_sweep.localCenter;
  this.m_lcB = this.m_bodyB.m_sweep.localCenter;
  this.m_lcC = this.m_bodyC.m_sweep.localCenter;
  this.m_lcD = this.m_bodyD.m_sweep.localCenter;
  this.m_mA = this.m_bodyA.m_invMass;
  this.m_mB = this.m_bodyB.m_invMass;
  this.m_mC = this.m_bodyC.m_invMass;
  this.m_mD = this.m_bodyD.m_invMass;
  this.m_iA = this.m_bodyA.m_invI;
  this.m_iB = this.m_bodyB.m_invI;
  this.m_iC = this.m_bodyC.m_invI;
  this.m_iD = this.m_bodyD.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var aC = this.m_bodyC.c_position.a;
  var vC = this.m_bodyC.c_velocity.v;
  var wC = this.m_bodyC.c_velocity.w;

  var aD = this.m_bodyD.c_position.a;
  var vD = this.m_bodyD.c_velocity.v;
  var wD = this.m_bodyD.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);
  var qC = Rot.neo(aC);
  var qD = Rot.neo(aD);

  this.m_mass = 0.0;

  if (this.m_type1 == RevoluteJoint.TYPE) {
    this.m_JvAC = Vec2.zero();
    this.m_JwA = 1.0;
    this.m_JwC = 1.0;
    this.m_mass += this.m_iA + this.m_iC;
  } else {
    var u = Rot.mulVec2(qC, this.m_localAxisC); // Vec2
    var rC = Rot.mulSub(qC, this.m_localAnchorC, this.m_lcC); // Vec2
    var rA = Rot.mulSub(qA, this.m_localAnchorA, this.m_lcA); // Vec2
    this.m_JvAC = u;
    this.m_JwC = Vec2.cross(rC, u);
    this.m_JwA = Vec2.cross(rA, u);
    this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
  }

  if (this.m_type2 == RevoluteJoint.TYPE) {
    this.m_JvBD = Vec2.zero();
    this.m_JwB = this.m_ratio;
    this.m_JwD = this.m_ratio;
    this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
  } else {
    var u = Rot.mulVec2(qD, this.m_localAxisD); // Vec2
    var rD = Rot.mulSub(qD, this.m_localAnchorD, this.m_lcD); // Vec2
    var rB = Rot.mulSub(qB, this.m_localAnchorB, this.m_lcB); // Vec2
    this.m_JvBD = Vec2.mul(this.m_ratio, u);
    this.m_JwD = this.m_ratio * Vec2.cross(rD, u);
    this.m_JwB = this.m_ratio * Vec2.cross(rB, u);
    this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
  }

  // Compute effective mass.
  this.m_mass = this.m_mass > 0.0 ? 1.0 / this.m_mass : 0.0;

  if (step.warmStarting) {
    vA.addMul(this.m_mA * this.m_impulse, this.m_JvAC);
    wA += this.m_iA * this.m_impulse * this.m_JwA;
    
    vB.addMul(this.m_mB * this.m_impulse, this.m_JvBD);
    wB += this.m_iB * this.m_impulse * this.m_JwB;
    
    vC.subMul(this.m_mC * this.m_impulse, this.m_JvAC);
    wC -= this.m_iC * this.m_impulse * this.m_JwC;
  
    vD.subMul(this.m_mD * this.m_impulse, this.m_JvBD);
    wD -= this.m_iD * this.m_impulse * this.m_JwD;

  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
  this.m_bodyC.c_velocity.v.set(vC);
  this.m_bodyC.c_velocity.w = wC;
  this.m_bodyD.c_velocity.v.set(vD);
  this.m_bodyD.c_velocity.w = wD;
}

GearJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;
  var vC = this.m_bodyC.c_velocity.v;
  var wC = this.m_bodyC.c_velocity.w;
  var vD = this.m_bodyD.c_velocity.v;
  var wD = this.m_bodyD.c_velocity.w;

  var Cdot = Vec2.dot(this.m_JvAC, vA) - Vec2.dot(this.m_JvAC, vC)
      + Vec2.dot(this.m_JvBD, vB) - Vec2.dot(this.m_JvBD, vD); // float
  Cdot += (this.m_JwA * wA - this.m_JwC * wC)
      + (this.m_JwB * wB - this.m_JwD * wD);

  var impulse = -this.m_mass * Cdot; // float
  this.m_impulse += impulse;

  vA.addMul(this.m_mA * impulse, this.m_JvAC);
  wA += this.m_iA * impulse * this.m_JwA;
  vB.addMul(this.m_mB * impulse, this.m_JvBD);
  wB += this.m_iB * impulse * this.m_JwB;
  vC.subMul(this.m_mC * impulse, this.m_JvAC);
  wC -= this.m_iC * impulse * this.m_JwC;
  vD.subMul(this.m_mD * impulse, this.m_JvBD);
  wD -= this.m_iD * impulse * this.m_JwD;

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
  this.m_bodyC.c_velocity.v.set(vC);
  this.m_bodyC.c_velocity.w = wC;
  this.m_bodyD.c_velocity.v.set(vD);
  this.m_bodyD.c_velocity.w = wD;
}

GearJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var cC = this.m_bodyC.c_position.c;
  var aC = this.m_bodyC.c_position.a;
  var cD = this.m_bodyD.c_position.c;
  var aD = this.m_bodyD.c_position.a;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);
  var qC = Rot.neo(aC);
  var qD = Rot.neo(aD);

  var linearError = 0.0; // float

  var coordinateA, coordinateB; // float

  var JvAC, JvBD; // Vec2
  var JwA, JwB, JwC, JwD; // float
  var mass = 0.0; // float

  if (this.m_type1 == RevoluteJoint.TYPE) {
    JvAC = Vec2.zero();
    JwA = 1.0;
    JwC = 1.0;
    mass += this.m_iA + this.m_iC;

    coordinateA = aA - aC - this.m_referenceAngleA;
  } else {
    var u = Rot.mulVec2(qC, this.m_localAxisC); // Vec2
    var rC = Rot.mulSub(qC, this.m_localAnchorC, this.m_lcC); // Vec2
    var rA = Rot.mulSub(qA, this.m_localAnchorA, this.m_lcA); // Vec2
    JvAC = u;
    JwC = Vec2.cross(rC, u);
    JwA = Vec2.cross(rA, u);
    mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;

    var pC = Vec2.sub(this.m_localAnchorC, this.m_lcC); // Vec2
    var pA = Rot.mulTVec2(qC, Vec2.add(rA, Vec2.sub(cA, cC))); // Vec2
    coordinateA = Vec2.dot(Vec2.sub(pA, pC), this.m_localAxisC);
  }

  if (this.m_type2 == RevoluteJoint.TYPE) {
    JvBD = Vec2.zero();
    JwB = this.m_ratio;
    JwD = this.m_ratio;
    mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);

    coordinateB = aB - aD - this.m_referenceAngleB;
  } else {
    var u = Rot.mulVec2(qD, this.m_localAxisD);
    var rD = Rot.mulSub(qD, this.m_localAnchorD, this.m_lcD);
    var rB = Rot.mulSub(qB, this.m_localAnchorB, this.m_lcB);
    JvBD = Vec2.mul(this.m_ratio, u);
    JwD = this.m_ratio * Vec2.cross(rD, u);
    JwB = this.m_ratio * Vec2.cross(rB, u);
    mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD
        * JwD * JwD + this.m_iB * JwB * JwB;

    var pD = Vec2.sub(this.m_localAnchorD, this.m_lcD); // Vec2
    var pB = Rot.mulTVec2(qD, Vec2.add(rB, Vec2.sub(cB, cD))); // Vec2
    coordinateB = Vec2.dot(pB, this.m_localAxisD)
        - Vec2.dot(pD, this.m_localAxisD);
  }

  var C = (coordinateA + this.m_ratio * coordinateB) - this.m_constant; // float

  var impulse = 0.0; // float
  if (mass > 0.0) {
    impulse = -C / mass;
  }

  cA.addMul(this.m_mA * impulse, JvAC);
  aA += this.m_iA * impulse * JwA;
  cB.addMul(this.m_mB * impulse, JvBD);
  aB += this.m_iB * impulse * JwB;
  cC.subMul(this.m_mC * impulse, JvAC);
  aC -= this.m_iC * impulse * JwC;
  cD.subMul(this.m_mD * impulse, JvBD);
  aD -= this.m_iD * impulse * JwD;

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;
  this.m_bodyC.c_position.c.set(cC);
  this.m_bodyC.c_position.a = aC;
  this.m_bodyD.c_position.c.set(cD);
  this.m_bodyD.c_position.a = aD;

  // TODO_ERIN not implemented
  return linearError < Settings.linearSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/MotorJoint.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/MotorJoint.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = MotorJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

MotorJoint.TYPE = 'motor-joint';
Joint.TYPES[MotorJoint.TYPE] = MotorJoint;

MotorJoint._super = Joint;
MotorJoint.prototype = Object.create(MotorJoint._super.prototype);

/**
 * @typedef {Object} MotorJointDef
 *
 * Motor joint definition.
 * 
 * @prop {float} angularOffset The bodyB angle minus bodyA angle in radians.
 * @prop {float} maxForce The maximum motor force in N.
 * @prop {float} maxTorque The maximum motor torque in N-m.
 * @prop {float} correctionFactor Position correction factor in the range [0,1].
 * @prop {Vec2} linearOffset Position of bodyB minus the position of bodyA, in
 *       bodyA's frame, in meters.
 */

var DEFAULTS = {
  maxForce : 1.0,
  maxTorque : 1.0,
  correctionFactor : 0.3
};

/**
 * A motor joint is used to control the relative motion between two bodies. A
 * typical usage is to control the movement of a dynamic body with respect to
 * the ground.
 *
 * @param {MotorJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function MotorJoint(def, bodyA, bodyB) {
  if (!(this instanceof MotorJoint)) {
    return new MotorJoint(def, bodyA, bodyB);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = MotorJoint.TYPE;

  this.m_linearOffset = Math.isFinite(def.linearOffset) ? def.linearOffset : bodyA.getLocalPoint(bodyB.getPosition());
  this.m_angularOffset = Math.isFinite(def.angularOffset) ? def.angularOffset : bodyB.getAngle() - bodyA.getAngle();

  this.m_linearImpulse = Vec2.zero();
  this.m_angularImpulse = 0.0;

  this.m_maxForce = def.maxForce;
  this.m_maxTorque = def.maxTorque;
  this.m_correctionFactor = def.correctionFactor;

  // Solver temp
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_linearError; // Vec2
  this.m_angularError; // float
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_linearMass; // Mat22
  this.m_angularMass; // float

  // Point-to-point constraint
  // Cdot = v2 - v1
  // = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)

  // Angle constraint
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
}

MotorJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    maxForce: this.m_maxForce,
    maxTorque: this.m_maxTorque,
    correctionFactor: this.m_correctionFactor,

    linearOffset: this.m_linearOffset,
    angularOffset: this.m_angularOffset,
  };
};

MotorJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new MotorJoint(data);
  return joint;
};

/**
 * @internal
 */
MotorJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }
}

/**
 * Set the maximum friction force in N.
 */
MotorJoint.prototype.setMaxForce = function(force) {
  _ASSERT && common.assert(Math.isFinite(force) && force >= 0.0);
  this.m_maxForce = force;
}

/**
 * Get the maximum friction force in N.
 */
MotorJoint.prototype.getMaxForce = function() {
  return this.m_maxForce;
}

/**
 * Set the maximum friction torque in N*m.
 */
MotorJoint.prototype.setMaxTorque = function(torque) {
  _ASSERT && common.assert(Math.isFinite(torque) && torque >= 0.0);
  this.m_maxTorque = torque;
}

/**
 * Get the maximum friction torque in N*m.
 */
MotorJoint.prototype.getMaxTorque = function() {
  return this.m_maxTorque;
}

/**
 * Set the position correction factor in the range [0,1].
 */
MotorJoint.prototype.setCorrectionFactor = function(factor) {
  _ASSERT && common.assert(Math.isFinite(factor) && 0.0 <= factor && factor <= 1.0);
  this.m_correctionFactor = factor;
}

/**
 * Get the position correction factor in the range [0,1].
 */
MotorJoint.prototype.getCorrectionFactor = function() {
  return this.m_correctionFactor;
}

/**
 * Set/get the target linear offset, in frame A, in meters.
 */
MotorJoint.prototype.setLinearOffset = function(linearOffset) {
  if (linearOffset.x != this.m_linearOffset.x
      || linearOffset.y != this.m_linearOffset.y) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_linearOffset = linearOffset;
  }
}

MotorJoint.prototype.getLinearOffset = function() {
  return this.m_linearOffset;
}

/**
 * Set/get the target angular offset, in radians.
 */
MotorJoint.prototype.setAngularOffset = function(angularOffset) {
  if (angularOffset != this.m_angularOffset) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_angularOffset = angularOffset;
  }
}

MotorJoint.prototype.getAngularOffset = function() {
  return this.m_angularOffset;
}

MotorJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getPosition();
}

MotorJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getPosition();
}

MotorJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(inv_dt, this.m_linearImpulse);
}

MotorJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_angularImpulse;
}

MotorJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA), qB = Rot.neo(aB);

  // Compute the effective mass matrix.
  this.m_rA = Rot.mulVec2(qA, Vec2.neg(this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.neg(this.m_localCenterB));

  // J = [-I -r1_skew I r2_skew]
  // [ 0 -1 0 1]
  // r_skew = [-ry; rx]

  // Matlab
  // K = [ mA+r1y^2*iA+mB+r2y^2*iB, -r1y*iA*r1x-r2y*iB*r2x, -r1y*iA-r2y*iB]
  // [ -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB, r1x*iA+r2x*iB]
  // [ -r1y*iA-r2y*iB, r1x*iA+r2x*iB, iA+iB]

  var mA = this.m_invMassA;
  var mB = this.m_invMassB;
  var iA = this.m_invIA;
  var iB = this.m_invIB;

  var K = new Mat22();
  K.ex.x = mA + mB + iA * this.m_rA.y * this.m_rA.y + iB * this.m_rB.y
      * this.m_rB.y;
  K.ex.y = -iA * this.m_rA.x * this.m_rA.y - iB * this.m_rB.x * this.m_rB.y;
  K.ey.x = K.ex.y;
  K.ey.y = mA + mB + iA * this.m_rA.x * this.m_rA.x + iB * this.m_rB.x
      * this.m_rB.x;

  this.m_linearMass = K.getInverse();

  this.m_angularMass = iA + iB;
  if (this.m_angularMass > 0.0) {
    this.m_angularMass = 1.0 / this.m_angularMass;
  }

  this.m_linearError = Vec2.zero();
  this.m_linearError.addCombine(1, cB, 1, this.m_rB);
  this.m_linearError.subCombine(1, cA, 1, this.m_rA);
  this.m_linearError.sub(Rot.mulVec2(qA, this.m_linearOffset));

  this.m_angularError = aB - aA - this.m_angularOffset;

  if (step.warmStarting) {
    // Scale impulses to support a variable time step.
    this.m_linearImpulse.mul(step.dtRatio);
    this.m_angularImpulse *= step.dtRatio;

    var P = Vec2.neo(this.m_linearImpulse.x, this.m_linearImpulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + this.m_angularImpulse);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + this.m_angularImpulse);

  } else {
    this.m_linearImpulse.setZero();
    this.m_angularImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

MotorJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA, mB = this.m_invMassB;
  var iA = this.m_invIA, iB = this.m_invIB;

  var h = step.dt;
  var inv_h = step.inv_dt;

  // Solve angular friction
  {
    var Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
    var impulse = -this.m_angularMass * Cdot;

    var oldImpulse = this.m_angularImpulse;
    var maxImpulse = h * this.m_maxTorque;
    this.m_angularImpulse = Math.clamp(this.m_angularImpulse + impulse,
        -maxImpulse, maxImpulse);
    impulse = this.m_angularImpulse - oldImpulse;

    wA -= iA * impulse;
    wB += iB * impulse;
  }

  // Solve linear friction
  {
    var Cdot = Vec2.zero();
    Cdot.addCombine(1, vB, 1, Vec2.cross(wB, this.m_rB));
    Cdot.subCombine(1, vA, 1, Vec2.cross(wA, this.m_rA));
    Cdot.addMul(inv_h * this.m_correctionFactor, this.m_linearError);

    var impulse = Vec2.neg(Mat22.mulVec2(this.m_linearMass, Cdot));
    var oldImpulse = Vec2.clone(this.m_linearImpulse);
    this.m_linearImpulse.add(impulse);

    var maxImpulse = h * this.m_maxForce;

    this.m_linearImpulse.clamp(maxImpulse);

    impulse = Vec2.sub(this.m_linearImpulse, oldImpulse);

    vA.subMul(mA, impulse);
    wA -= iA * Vec2.cross(this.m_rA, impulse);

    vB.addMul(mB, impulse);
    wB += iB * Vec2.cross(this.m_rB, impulse);
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

MotorJoint.prototype.solvePositionConstraints = function(step) {
  return true;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/MouseJoint.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/MouseJoint.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = MouseJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

MouseJoint.TYPE = 'mouse-joint';
Joint.TYPES[MouseJoint.TYPE] = MouseJoint;

MouseJoint._super = Joint;
MouseJoint.prototype = Object.create(MouseJoint._super.prototype);

/**
 * @typedef {Object} MouseJointDef
 *
 * Mouse joint definition. This requires a world target point, tuning
 * parameters, and the time step.
 * 
 * @prop [maxForce = 0.0] The maximum constraint force that can be exerted to
 *       move the candidate body. Usually you will express as some multiple of
 *       the weight (multiplier * mass * gravity).
 * @prop [frequencyHz = 5.0] The response speed.
 * @prop [dampingRatio = 0.7] The damping ratio. 0 = no damping, 1 = critical
 *       damping.
 *
 * @prop {Vec2} target The initial world target point. This is assumed to
 *       coincide with the body anchor initially.
 */

var DEFAULTS = {
  maxForce : 0.0,
  frequencyHz : 5.0,
  dampingRatio : 0.7
};

/**
 * A mouse joint is used to make a point on a body track a specified world
 * point. This a soft constraint with a maximum force. This allows the
 * constraint to stretch and without applying huge forces.
 * 
 * NOTE: this joint is not documented in the manual because it was developed to
 * be used in the testbed. If you want to learn how to use the mouse joint, look
 * at the testbed.
 *
 * @param {MouseJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function MouseJoint(def, bodyA, bodyB, target) {
  if (!(this instanceof MouseJoint)) {
    return new MouseJoint(def, bodyA, bodyB, target);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = MouseJoint.TYPE;

  _ASSERT && common.assert(Math.isFinite(def.maxForce) && def.maxForce >= 0.0);
  _ASSERT && common.assert(Math.isFinite(def.frequencyHz) && def.frequencyHz >= 0.0);
  _ASSERT && common.assert(Math.isFinite(def.dampingRatio) && def.dampingRatio >= 0.0);

  this.m_targetA = target ? Vec2.clone(target) : def.target || Vec2.zero();
  this.m_localAnchorB = Transform.mulTVec2(bodyB.getTransform(), this.m_targetA);

  this.m_maxForce = def.maxForce;
  this.m_impulse = Vec2.zero();

  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;

  this.m_beta = 0.0;
  this.m_gamma = 0.0;

  // Solver temp
  this.m_rB = Vec2.zero();
  this.m_localCenterB = Vec2.zero();
  this.m_invMassB = 0.0;
  this.m_invIB = 0.0;
  this.mass = new Mat22()
  this.m_C = Vec2.zero();

  // p = attached point, m = mouse point
  // C = p - m
  // Cdot = v
  // = v + cross(w, r)
  // J = [I r_skew]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)
}

MouseJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    target: this.m_targetA,
    maxForce: this.m_maxForce,
    frequencyHz: this.m_frequencyHz,
    dampingRatio: this.m_dampingRatio,

    _localAnchorB: this.m_localAnchorB,
  };
};

MouseJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  data.target = Vec2(data.target);
  var joint = new MouseJoint(data);
  if (data._localAnchorB) {
    joint.m_localAnchorB = data._localAnchorB;
  }
  return joint;
};

/**
 * Use this to update the target point.
 */
MouseJoint.prototype.setTarget = function(target) {
  if (this.m_bodyB.isAwake() == false) {
    this.m_bodyB.setAwake(true);
  }
  this.m_targetA = Vec2.clone(target);
}

MouseJoint.prototype.getTarget = function() {
  return this.m_targetA;
}

/**
 * Set/get the maximum force in Newtons.
 */
MouseJoint.prototype.setMaxForce = function(force) {
  this.m_maxForce = force;
}

MouseJoint.getMaxForce = function() {
  return this.m_maxForce;
}

/**
 * Set/get the frequency in Hertz.
 */
MouseJoint.prototype.setFrequency = function(hz) {
  this.m_frequencyHz = hz;
}

MouseJoint.prototype.getFrequency = function() {
  return this.m_frequencyHz;
}

/**
 * Set/get the damping ratio (dimensionless).
 */
MouseJoint.prototype.setDampingRatio = function(ratio) {
  this.m_dampingRatio = ratio;
}

MouseJoint.prototype.getDampingRatio = function() {
  return this.m_dampingRatio;
}

MouseJoint.prototype.getAnchorA = function() {
  return Vec2.clone(this.m_targetA);
}

MouseJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

MouseJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(inv_dt, this.m_impulse);
}

MouseJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * 0.0;
}

MouseJoint.prototype.shiftOrigin = function(newOrigin) {
  this.m_targetA.sub(newOrigin);
}

MouseJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIB = this.m_bodyB.m_invI;

  var position = this.m_bodyB.c_position;
  var velocity = this.m_bodyB.c_velocity;

  var cB = position.c;
  var aB = position.a;
  var vB = velocity.v;
  var wB = velocity.w;

  var qB = Rot.neo(aB);

  var mass = this.m_bodyB.getMass();

  // Frequency
  var omega = 2.0 * Math.PI * this.m_frequencyHz;

  // Damping coefficient
  var d = 2.0 * mass * this.m_dampingRatio * omega;

  // Spring stiffness
  var k = mass * (omega * omega);

  // magic formulas
  // gamma has units of inverse mass.
  // beta has units of inverse time.
  var h = step.dt;
  _ASSERT && common.assert(d + h * k > Math.EPSILON);
  this.m_gamma = h * (d + h * k);
  if (this.m_gamma != 0.0) {
    this.m_gamma = 1.0 / this.m_gamma;
  }
  this.m_beta = h * k * this.m_gamma;

  // Compute the effective mass matrix.
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // K = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) *
  // invI2 * skew(r2)]
  // = [1/m1+1/m2 0 ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y
  // -r1.x*r1.y]
  // [ 0 1/m1+1/m2] [-r1.x*r1.y r1.x*r1.x] [-r1.x*r1.y r1.x*r1.x]
  var K = new Mat22();
  K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y
      + this.m_gamma;
  K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
  K.ey.x = K.ex.y;
  K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x
      + this.m_gamma;

  this.m_mass = K.getInverse();

  this.m_C.set(cB);
  this.m_C.addCombine(1, this.m_rB, -1, this.m_targetA);
  this.m_C.mul(this.m_beta);

  // Cheat with some damping
  wB *= 0.98;

  if (step.warmStarting) {
    this.m_impulse.mul(step.dtRatio);
    vB.addMul(this.m_invMassB, this.m_impulse);
    wB += this.m_invIB * Vec2.cross(this.m_rB, this.m_impulse);

  } else {
    this.m_impulse.setZero();
  }

  velocity.v.set(vB);
  velocity.w = wB;
}

MouseJoint.prototype.solveVelocityConstraints = function(step) {
  var velocity = this.m_bodyB.c_velocity;
  var vB = Vec2.clone(velocity.v);
  var wB = velocity.w;

  // Cdot = v + cross(w, r)

  var Cdot = Vec2.cross(wB, this.m_rB);
  Cdot.add(vB);

  Cdot.addCombine(1, this.m_C, this.m_gamma, this.m_impulse);
  Cdot.neg();

  var impulse = Mat22.mulVec2(this.m_mass, Cdot);

  var oldImpulse = Vec2.clone(this.m_impulse);
  this.m_impulse.add(impulse);
  var maxImpulse = step.dt * this.m_maxForce;
  this.m_impulse.clamp(maxImpulse);
  impulse = Vec2.sub(this.m_impulse, oldImpulse);

  vB.addMul(this.m_invMassB, impulse);
  wB += this.m_invIB * Vec2.cross(this.m_rB, impulse);

  velocity.v.set(vB);
  velocity.w = wB;
}

MouseJoint.prototype.solvePositionConstraints = function(step) {
  return true;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/PrismaticJoint.js":
/*!****************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/PrismaticJoint.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = PrismaticJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

var inactiveLimit = 0;
var atLowerLimit = 1;
var atUpperLimit = 2;
var equalLimits = 3;

PrismaticJoint.TYPE = 'prismatic-joint';
Joint.TYPES[PrismaticJoint.TYPE] = PrismaticJoint;

PrismaticJoint._super = Joint;
PrismaticJoint.prototype = Object.create(PrismaticJoint._super.prototype);

/**
 * @typedef {Object} PrismaticJointDef
 *
 * Prismatic joint definition. This requires defining a line of motion using an
 * axis and an anchor point. The definition uses local anchor points and a local
 * axis so that the initial configuration can violate the constraint slightly.
 * The joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 * 
 * @prop {boolean} enableLimit Enable/disable the joint limit.
 * @prop {float} lowerTranslation The lower translation limit, usually in
 *       meters.
 * @prop {float} upperTranslation The upper translation limit, usually in
 *       meters.
 * @prop {boolean} enableMotor Enable/disable the joint motor.
 * @prop {float} maxMotorForce The maximum motor torque, usually in N-m.
 * @prop {float} motorSpeed The desired motor speed in radians per second.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {Vec2} localAxisA The local translation unit axis in bodyA.
 * @prop {float} referenceAngle The constrained angle between the bodies:
 *       bodyB_angle - bodyA_angle.
 */

var DEFAULTS = {
  enableLimit : false,
  lowerTranslation : 0.0,
  upperTranslation : 0.0,
  enableMotor : false,
  maxMotorForce : 0.0,
  motorSpeed : 0.0
};

/**
 * A prismatic joint. This joint provides one degree of freedom: translation
 * along an axis fixed in bodyA. Relative rotation is prevented. You can use a
 * joint limit to restrict the range of motion and a joint motor to drive the
 * motion or to model joint friction.
 *
 * @param {PrismaticJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function PrismaticJoint(def, bodyA, bodyB, anchor, axis) {
  if (!(this instanceof PrismaticJoint)) {
    return new PrismaticJoint(def, bodyA, bodyB, anchor, axis);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = PrismaticJoint.TYPE;

  this.m_localAnchorA = Vec2.clone(anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB = Vec2.clone(anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.zero());
  this.m_localXAxisA = Vec2.clone(axis ? bodyA.getLocalVector(axis) : def.localAxisA || Vec2.neo(1.0, 0.0));
  this.m_localXAxisA.normalize();
  this.m_localYAxisA = Vec2.cross(1.0, this.m_localXAxisA);
  this.m_referenceAngle = Math.isFinite(def.referenceAngle) ? def.referenceAngle : bodyB.getAngle() - bodyA.getAngle();

  this.m_impulse = Vec3();
  this.m_motorMass = 0.0;
  this.m_motorImpulse = 0.0;

  this.m_lowerTranslation = def.lowerTranslation;
  this.m_upperTranslation = def.upperTranslation;
  this.m_maxMotorForce = def.maxMotorForce;
  this.m_motorSpeed = def.motorSpeed;
  this.m_enableLimit = def.enableLimit;
  this.m_enableMotor = def.enableMotor;
  this.m_limitState = inactiveLimit;

  this.m_axis = Vec2.zero();
  this.m_perp = Vec2.zero();

  // Solver temp
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_axis, this.m_perp; // Vec2
  this.m_s1, this.m_s2; // float
  this.m_a1, this.m_a2; // float
  this.m_K = new Mat33();
  this.m_motorMass; // float

  // Linear constraint (point-to-line)
  // d = p2 - p1 = x2 + r2 - x1 - r1
  // C = dot(perp, d)
  // Cdot = dot(d, cross(w1, perp)) + dot(perp, v2 + cross(w2, r2) - v1 -
  // cross(w1, r1))
  // = -dot(perp, v1) - dot(cross(d + r1, perp), w1) + dot(perp, v2) +
  // dot(cross(r2, perp), v2)
  // J = [-perp, -cross(d + r1, perp), perp, cross(r2,perp)]
  //
  // Angular constraint
  // C = a2 - a1 + a_initial
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  //
  // K = J * invM * JT
  //
  // J = [-a -s1 a s2]
  // [0 -1 0 1]
  // a = perp
  // s1 = cross(d + r1, a) = cross(p2 - x1, a)
  // s2 = cross(r2, a) = cross(p2 - x2, a)

  // Motor/Limit linear constraint
  // C = dot(ax1, d)
  // Cdot = = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) +
  // dot(cross(r2, ax1), v2)
  // J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]

  // Block Solver
  // We develop a block solver that includes the joint limit. This makes the
  // limit stiff (inelastic) even
  // when the mass has poor distribution (leading to large torques about the
  // joint anchor points).
  //
  // The Jacobian has 3 rows:
  // J = [-uT -s1 uT s2] // linear
  // [0 -1 0 1] // angular
  // [-vT -a1 vT a2] // limit
  //
  // u = perp
  // v = axis
  // s1 = cross(d + r1, u), s2 = cross(r2, u)
  // a1 = cross(d + r1, v), a2 = cross(r2, v)

  // M * (v2 - v1) = JT * df
  // J * v2 = bias
  //
  // v2 = v1 + invM * JT * df
  // J * (v1 + invM * JT * df) = bias
  // K * df = bias - J * v1 = -Cdot
  // K = J * invM * JT
  // Cdot = J * v1 - bias
  //
  // Now solve for f2.
  // df = f2 - f1
  // K * (f2 - f1) = -Cdot
  // f2 = invK * (-Cdot) + f1
  //
  // Clamp accumulated limit impulse.
  // lower: f2(3) = max(f2(3), 0)
  // upper: f2(3) = min(f2(3), 0)
  //
  // Solve for correct f2(1:2)
  // K(1:2, 1:2) * f2(1:2) = -Cdot(1:2) - K(1:2,3) * f2(3) + K(1:2,1:3) * f1
  // = -Cdot(1:2) - K(1:2,3) * f2(3) + K(1:2,1:2) * f1(1:2) + K(1:2,3) * f1(3)
  // K(1:2, 1:2) * f2(1:2) = -Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3)) +
  // K(1:2,1:2) * f1(1:2)
  // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) +
  // f1(1:2)
  //
  // Now compute impulse to be applied:
  // df = f2 - f1
}

PrismaticJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    lowerTranslation: this.m_lowerTranslation,
    upperTranslation: this.m_upperTranslation,
    maxMotorForce: this.m_maxMotorForce,
    motorSpeed: this.m_motorSpeed,
    enableLimit: this.m_enableLimit,
    enableMotor: this.m_enableMotor,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    localAxisA: this.m_localXAxisA,
    referenceAngle: this.m_referenceAngle,
  };
};

PrismaticJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  data.localAxisA = Vec2(data.localAxisA);
  var joint = new PrismaticJoint(data);
  return joint;
};

/**
 * @internal
 */
PrismaticJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }

  if (def.localAxisA) {
    this.m_localXAxisA.set(def.localAxisA);
    this.m_localYAxisA.set(Vec2.cross(1.0, def.localAxisA));
  }
}

/**
 * The local anchor point relative to bodyA's origin.
 */
PrismaticJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
PrismaticJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * The local joint axis relative to bodyA.
 */
PrismaticJoint.prototype.getLocalAxisA = function() {
  return this.m_localXAxisA;
}

/**
 * Get the reference angle.
 */
PrismaticJoint.prototype.getReferenceAngle = function() {
  return this.m_referenceAngle;
}

/**
 * Get the current joint translation, usually in meters.
 */
PrismaticJoint.prototype.getJointTranslation = function() {
  var pA = this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  var pB = this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  var d = Vec2.sub(pB, pA);
  var axis = this.m_bodyA.getWorldVector(this.m_localXAxisA);

  var translation = Vec2.dot(d, axis);
  return translation;
}

/**
 * Get the current joint translation speed, usually in meters per second.
 */
PrismaticJoint.prototype.getJointSpeed = function() {
  var bA = this.m_bodyA;
  var bB = this.m_bodyB;

  var rA = Rot.mulVec2(bA.m_xf.q, Vec2.sub(this.m_localAnchorA, bA.m_sweep.localCenter)); // Vec2
  var rB = Rot.mulVec2(bB.m_xf.q, Vec2.sub(this.m_localAnchorB, bB.m_sweep.localCenter)); // Vec2
  var p1 = Vec2.add(bA.m_sweep.c, rA); // Vec2
  var p2 = Vec2.add(bB.m_sweep.c, rB); // Vec2
  var d = Vec2.sub(p2, p1); // Vec2
  var axis = Rot.mulVec2(bA.m_xf.q, this.m_localXAxisA); // Vec2

  var vA = bA.m_linearVelocity; // Vec2
  var vB = bB.m_linearVelocity; // Vec2
  var wA = bA.m_angularVelocity; // float
  var wB = bB.m_angularVelocity; // float

  var speed = Vec2.dot(d, Vec2.cross(wA, axis))
      + Vec2.dot(axis, Vec2.sub(Vec2.addCross(vB, wB, rB), Vec2.addCross(vA, wA, rA))); // float
  return speed;
}

/**
 * Is the joint limit enabled?
 */
PrismaticJoint.prototype.isLimitEnabled = function() {
  return this.m_enableLimit;
}

/**
 * Enable/disable the joint limit.
 */
PrismaticJoint.prototype.enableLimit = function(flag) {
  if (flag != this.m_enableLimit) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_enableLimit = flag;
    this.m_impulse.z = 0.0;
  }
}

/**
 * Get the lower joint limit, usually in meters.
 */
PrismaticJoint.prototype.getLowerLimit = function() {
  return this.m_lowerTranslation;
}

/**
 * Get the upper joint limit, usually in meters.
 */
PrismaticJoint.prototype.getUpperLimit = function() {
  return this.m_upperTranslation;
}

/**
 * Set the joint limits, usually in meters.
 */
PrismaticJoint.prototype.setLimits = function(lower, upper) {
  _ASSERT && common.assert(lower <= upper);
  if (lower != this.m_lowerTranslation || upper != this.m_upperTranslation) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_lowerTranslation = lower;
    this.m_upperTranslation = upper;
    this.m_impulse.z = 0.0;
  }
}

/**
 * Is the joint motor enabled?
 */
PrismaticJoint.prototype.isMotorEnabled = function() {
  return this.m_enableMotor;
}

/**
 * Enable/disable the joint motor.
 */
PrismaticJoint.prototype.enableMotor = function(flag) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_enableMotor = flag;
}

/**
 * Set the motor speed, usually in meters per second.
 */
PrismaticJoint.prototype.setMotorSpeed = function(speed) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_motorSpeed = speed;
}

/**
 * Set the maximum motor force, usually in N.
 */
PrismaticJoint.prototype.setMaxMotorForce = function(force) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_maxMotorForce = force;
}

PrismaticJoint.prototype.getMaxMotorForce = function() {
  return this.m_maxMotorForce;
}

/**
 * Get the motor speed, usually in meters per second.
 */
PrismaticJoint.prototype.getMotorSpeed = function() {
  return this.m_motorSpeed;
}

/**
 * Get the current motor force given the inverse time step, usually in N.
 */
PrismaticJoint.prototype.getMotorForce = function(inv_dt) {
  return inv_dt * this.m_motorImpulse;
}

PrismaticJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

PrismaticJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

PrismaticJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.combine(this.m_impulse.x, this.m_perp, this.m_motorImpulse + this.m_impulse.z, this.m_axis).mul(inv_dt);
}

PrismaticJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_impulse.y;
}

PrismaticJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  // Compute the effective masses.
  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));
  var d = Vec2.zero();
  d.addCombine(1, cB, 1, rB);
  d.subCombine(1, cA, 1, rA);

  var mA = this.m_invMassA, mB = this.m_invMassB;
  var iA = this.m_invIA, iB = this.m_invIB;

  // Compute motor Jacobian and effective mass.
  {
    this.m_axis = Rot.mulVec2(qA, this.m_localXAxisA);
    this.m_a1 = Vec2.cross(Vec2.add(d, rA), this.m_axis);
    this.m_a2 = Vec2.cross(rB, this.m_axis);

    this.m_motorMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2
        * this.m_a2;
    if (this.m_motorMass > 0.0) {
      this.m_motorMass = 1.0 / this.m_motorMass;
    }
  }

  // Prismatic constraint.
  {
    this.m_perp = Rot.mulVec2(qA, this.m_localYAxisA);

    this.m_s1 = Vec2.cross(Vec2.add(d, rA), this.m_perp);
    this.m_s2 = Vec2.cross(rB, this.m_perp);

    var s1test = Vec2.cross(rA, this.m_perp);

    var k11 = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
    var k12 = iA * this.m_s1 + iB * this.m_s2;
    var k13 = iA * this.m_s1 * this.m_a1 + iB * this.m_s2 * this.m_a2;
    var k22 = iA + iB;
    if (k22 == 0.0) {
      // For bodies with fixed rotation.
      k22 = 1.0;
    }
    var k23 = iA * this.m_a1 + iB * this.m_a2;
    var k33 = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;

    this.m_K.ex.set(k11, k12, k13);
    this.m_K.ey.set(k12, k22, k23);
    this.m_K.ez.set(k13, k23, k33);
  }

  // Compute motor and limit terms.
  if (this.m_enableLimit) {

    var jointTranslation = Vec2.dot(this.m_axis, d); // float
    if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Settings.linearSlop) {
      this.m_limitState = equalLimits;

    } else if (jointTranslation <= this.m_lowerTranslation) {
      if (this.m_limitState != atLowerLimit) {
        this.m_limitState = atLowerLimit;
        this.m_impulse.z = 0.0;
      }

    } else if (jointTranslation >= this.m_upperTranslation) {
      if (this.m_limitState != atUpperLimit) {
        this.m_limitState = atUpperLimit;
        this.m_impulse.z = 0.0;
      }

    } else {
      this.m_limitState = inactiveLimit;
      this.m_impulse.z = 0.0;
    }

  } else {
    this.m_limitState = inactiveLimit;
    this.m_impulse.z = 0.0;
  }

  if (this.m_enableMotor == false) {
    this.m_motorImpulse = 0.0;
  }

  if (step.warmStarting) {
    // Account for variable time step.
    this.m_impulse.mul(step.dtRatio);
    this.m_motorImpulse *= step.dtRatio;

    var P = Vec2.combine(this.m_impulse.x, this.m_perp, this.m_motorImpulse
        + this.m_impulse.z, this.m_axis);
    var LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y
        + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
    var LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y
        + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  } else {
    this.m_impulse.setZero();
    this.m_motorImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

PrismaticJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA;
  var mB = this.m_invMassB;
  var iA = this.m_invIA;
  var iB = this.m_invIB;

  // Solve linear motor constraint.
  if (this.m_enableMotor && this.m_limitState != equalLimits) {
    var Cdot = Vec2.dot(this.m_axis, Vec2.sub(vB, vA)) + this.m_a2 * wB
        - this.m_a1 * wA;
    var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
    var oldImpulse = this.m_motorImpulse;
    var maxImpulse = step.dt * this.m_maxMotorForce;
    this.m_motorImpulse = Math.clamp(this.m_motorImpulse + impulse,
        -maxImpulse, maxImpulse);
    impulse = this.m_motorImpulse - oldImpulse;

    var P = Vec2.mul(impulse, this.m_axis);
    var LA = impulse * this.m_a1;
    var LB = impulse * this.m_a2;

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  }

  var Cdot1 = Vec2.zero();
  Cdot1.x += Vec2.dot(this.m_perp, vB) + this.m_s2 * wB;
  Cdot1.x -= Vec2.dot(this.m_perp, vA) + this.m_s1 * wA;
  Cdot1.y = wB - wA;

  if (this.m_enableLimit && this.m_limitState != inactiveLimit) {
    // Solve prismatic and limit constraint in block form.
    var Cdot2 = 0;
    Cdot2 += Vec2.dot(this.m_axis, vB) + this.m_a2 * wB;
    Cdot2 -= Vec2.dot(this.m_axis, vA) + this.m_a1 * wA;

    var Cdot = Vec3(Cdot1.x, Cdot1.y, Cdot2);

    var f1 = Vec3(this.m_impulse);
    var df = this.m_K.solve33(Vec3.neg(Cdot)); // Vec3
    this.m_impulse.add(df);

    if (this.m_limitState == atLowerLimit) {
      this.m_impulse.z = Math.max(this.m_impulse.z, 0.0);
    } else if (this.m_limitState == atUpperLimit) {
      this.m_impulse.z = Math.min(this.m_impulse.z, 0.0);
    }

    // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) +
    // f1(1:2)
    var b = Vec2.combine(-1, Cdot1, -(this.m_impulse.z - f1.z), Vec2.neo(this.m_K.ez.x, this.m_K.ez.y)); // Vec2
    var f2r = Vec2.add(this.m_K.solve22(b), Vec2.neo(f1.x, f1.y)); // Vec2
    this.m_impulse.x = f2r.x;
    this.m_impulse.y = f2r.y;

    df = Vec3.sub(this.m_impulse, f1);

    var P = Vec2.combine(df.x, this.m_perp, df.z, this.m_axis); // Vec2
    var LA = df.x * this.m_s1 + df.y + df.z * this.m_a1; // float
    var LB = df.x * this.m_s2 + df.y + df.z * this.m_a2; // float

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  } else {
    // Limit is inactive, just solve the prismatic constraint in block form.
    var df = this.m_K.solve22(Vec2.neg(Cdot1)); // Vec2
    this.m_impulse.x += df.x;
    this.m_impulse.y += df.y;

    var P = Vec2.mul(df.x, this.m_perp); // Vec2
    var LA = df.x * this.m_s1 + df.y; // float
    var LB = df.x * this.m_s2 + df.y; // float

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

PrismaticJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  var mA = this.m_invMassA;
  var mB = this.m_invMassB;
  var iA = this.m_invIA;
  var iB = this.m_invIB;

  // Compute fresh Jacobians
  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA)); // Vec2
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB)); // Vec2
  var d = Vec2.sub(Vec2.add(cB, rB), Vec2.add(cA, rA)); // Vec2

  var axis = Rot.mulVec2(qA, this.m_localXAxisA); // Vec2
  var a1 = Vec2.cross(Vec2.add(d, rA), axis); // float
  var a2 = Vec2.cross(rB, axis); // float
  var perp = Rot.mulVec2(qA, this.m_localYAxisA); // Vec2

  var s1 = Vec2.cross(Vec2.add(d, rA), perp); // float
  var s2 = Vec2.cross(rB, perp); // float

  var impulse = Vec3();
  var C1 = Vec2.zero(); // Vec2
  C1.x = Vec2.dot(perp, d);
  C1.y = aB - aA - this.m_referenceAngle;

  var linearError = Math.abs(C1.x); // float
  var angularError = Math.abs(C1.y); // float

  var linearSlop = Settings.linearSlop;
  var maxLinearCorrection = Settings.maxLinearCorrection;

  var active = false; // bool
  var C2 = 0.0; // float
  if (this.m_enableLimit) {

    var translation = Vec2.dot(axis, d); // float
    if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * linearSlop) {
      // Prevent large angular corrections
      C2 = Math.clamp(translation, -maxLinearCorrection, maxLinearCorrection);
      linearError = Math.max(linearError, Math.abs(translation));
      active = true;

    } else if (translation <= this.m_lowerTranslation) {
      // Prevent large linear corrections and allow some slop.
      C2 = Math.clamp(translation - this.m_lowerTranslation + linearSlop,
          -maxLinearCorrection, 0.0);
      linearError = Math
          .max(linearError, this.m_lowerTranslation - translation);
      active = true;

    } else if (translation >= this.m_upperTranslation) {
      // Prevent large linear corrections and allow some slop.
      C2 = Math.clamp(translation - this.m_upperTranslation - linearSlop, 0.0,
          maxLinearCorrection);
      linearError = Math
          .max(linearError, translation - this.m_upperTranslation);
      active = true;
    }
  }

  if (active) {
    var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2; // float
    var k12 = iA * s1 + iB * s2; // float
    var k13 = iA * s1 * a1 + iB * s2 * a2; // float
    var k22 = iA + iB; // float
    if (k22 == 0.0) {
      // For fixed rotation
      k22 = 1.0;
    }
    var k23 = iA * a1 + iB * a2; // float
    var k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2; // float

    var K = new Mat33()
    K.ex.set(k11, k12, k13);
    K.ey.set(k12, k22, k23);
    K.ez.set(k13, k23, k33);

    var C = Vec3();
    C.x = C1.x;
    C.y = C1.y;
    C.z = C2;

    impulse = K.solve33(Vec3.neg(C));
  } else {
    var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2; // float
    var k12 = iA * s1 + iB * s2; // float
    var k22 = iA + iB; // float
    if (k22 == 0.0) {
      k22 = 1.0;
    }

    var K = new Mat22();
    K.ex.set(k11, k12);
    K.ey.set(k12, k22);

    var impulse1 = K.solve(Vec2.neg(C1)); // Vec2
    impulse.x = impulse1.x;
    impulse.y = impulse1.y;
    impulse.z = 0.0;
  }

  var P = Vec2.combine(impulse.x, perp, impulse.z, axis); // Vec2
  var LA = impulse.x * s1 + impulse.y + impulse.z * a1; // float
  var LB = impulse.x * s2 + impulse.y + impulse.z * a2; // float

  cA.subMul(mA, P);
  aA -= iA * LA;
  cB.addMul(mB, P);
  aB += iB * LB;

  this.m_bodyA.c_position.c = cA;
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c = cB;
  this.m_bodyB.c_position.a = aB;

  return linearError <= Settings.linearSlop
      && angularError <= Settings.angularSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/PulleyJoint.js":
/*!*************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/PulleyJoint.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = PulleyJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

PulleyJoint.TYPE = 'pulley-joint';
PulleyJoint.MIN_PULLEY_LENGTH = 2.0; // minPulleyLength
Joint.TYPES[PulleyJoint.TYPE] = PulleyJoint;

PulleyJoint._super = Joint;
PulleyJoint.prototype = Object.create(PulleyJoint._super.prototype);

/**
 * @typedef {Object} PulleyJointDef
 *
 * Pulley joint definition. This requires two ground anchors, two dynamic body
 * anchor points, and a pulley ratio.
 *
 * @prop {Vec2} groundAnchorA The first ground anchor in world coordinates.
 *          This point never moves.
 * @prop {Vec2} groundAnchorB The second ground anchor in world coordinates.
 *          This point never moves.
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {float} ratio The pulley ratio, used to simulate a block-and-tackle.
 * @prop {float} lengthA The reference length for the segment attached to bodyA.
 * @prop {float} lengthB The reference length for the segment attached to bodyB.
 */
var PulleyJointDef = {
  collideConnected : true
};

/**
 * The pulley joint is connected to two bodies and two fixed ground points. The
 * pulley supports a ratio such that: length1 + ratio * length2 <= constant
 * 
 * Yes, the force transmitted is scaled by the ratio.
 * 
 * Warning: the pulley joint can get a bit squirrelly by itself. They often work
 * better when combined with prismatic joints. You should also cover the the
 * anchor points with static shapes to prevent one side from going to zero
 * length.
 *
 * @param {PulleyJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function PulleyJoint(def, bodyA, bodyB, groundA, groundB, anchorA, anchorB, ratio) {
  if (!(this instanceof PulleyJoint)) {
    return new PulleyJoint(def, bodyA, bodyB, groundA, groundB, anchorA, anchorB, ratio);
  }

  def = options(def, PulleyJointDef);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = PulleyJoint.TYPE;
  this.m_groundAnchorA = groundA ? groundA : def.groundAnchorA || Vec2.neo(-1.0, 1.0);
  this.m_groundAnchorB = groundB ? groundB : def.groundAnchorB || Vec2.neo(1.0, 1.0);
  this.m_localAnchorA = anchorA ? bodyA.getLocalPoint(anchorA) : def.localAnchorA || Vec2.neo(-1.0, 0.0);
  this.m_localAnchorB = anchorB ? bodyB.getLocalPoint(anchorB) : def.localAnchorB || Vec2.neo(1.0, 0.0);
  this.m_lengthA = Math.isFinite(def.lengthA) ? def.lengthA : Vec2.distance(anchorA, groundA);
  this.m_lengthB = Math.isFinite(def.lengthB) ? def.lengthB : Vec2.distance(anchorB, groundB);
  this.m_ratio = Math.isFinite(ratio) ? ratio : def.ratio;

  _ASSERT && common.assert(ratio > Math.EPSILON);

  this.m_constant = this.m_lengthA + this.m_ratio * this.m_lengthB;

  this.m_impulse = 0.0;

  // Solver temp
  this.m_uA; // Vec2
  this.m_uB; // Vec2
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_mass; // float

  // Pulley:
  // length1 = norm(p1 - s1)
  // length2 = norm(p2 - s2)
  // C0 = (length1 + ratio * length2)_initial
  // C = C0 - (length1 + ratio * length2)
  // u1 = (p1 - s1) / norm(p1 - s1)
  // u2 = (p2 - s2) / norm(p2 - s2)
  // Cdot = -dot(u1, v1 + cross(w1, r1)) - ratio * dot(u2, v2 + cross(w2, r2))
  // J = -[u1 cross(r1, u1) ratio * u2 ratio * cross(r2, u2)]
  // K = J * invM * JT
  // = invMass1 + invI1 * cross(r1, u1)^2 + ratio^2 * (invMass2 + invI2 *
  // cross(r2, u2)^2)
}

PulleyJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    groundAnchorA: this.m_groundAnchorA,
    groundAnchorB: this.m_groundAnchorB,
    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    lengthA: this.m_lengthA,
    lengthB: this.m_lengthB,
    ratio: this.m_ratio,
  };
};

PulleyJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new PulleyJoint(data);
  return joint;
};

/**
 * Get the first ground anchor.
 */
PulleyJoint.prototype.getGroundAnchorA = function() {
  return this.m_groundAnchorA;
}

/**
 * Get the second ground anchor.
 */
PulleyJoint.prototype.getGroundAnchorB = function() {
  return this.m_groundAnchorB;
}

/**
 * Get the current length of the segment attached to bodyA.
 */
PulleyJoint.prototype.getLengthA = function() {
  return this.m_lengthA;
}

/**
 * Get the current length of the segment attached to bodyB.
 */
PulleyJoint.prototype.getLengthB = function() {
  return this.m_lengthB;
}

/**
 * Get the pulley ratio.
 */
PulleyJoint.prototype.getRatio = function() {
  return this.m_ratio;
}

/**
 * Get the current length of the segment attached to bodyA.
 */
PulleyJoint.prototype.getCurrentLengthA = function() {
  var p = this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  var s = this.m_groundAnchorA;
  return Vec2.distance(p, s);
}

/**
 * Get the current length of the segment attached to bodyB.
 */
PulleyJoint.prototype.getCurrentLengthB = function() {
  var p = this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  var s = this.m_groundAnchorB;
  return Vec2.distance(p, s);
}

PulleyJoint.prototype.shiftOrigin = function(newOrigin) {
  this.m_groundAnchorA.sub(newOrigin);
  this.m_groundAnchorB.sub(newOrigin);
}

PulleyJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

PulleyJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

PulleyJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(this.m_impulse, this.m_uB).mul(inv_dt);
}

PulleyJoint.prototype.getReactionTorque = function(inv_dt) {
  return 0.0;
}

PulleyJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  this.m_rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // Get the pulley axes.
  this.m_uA = Vec2.sub(Vec2.add(cA, this.m_rA), this.m_groundAnchorA);
  this.m_uB = Vec2.sub(Vec2.add(cB, this.m_rB), this.m_groundAnchorB);

  var lengthA = this.m_uA.length();
  var lengthB = this.m_uB.length();

  if (lengthA > 10.0 * Settings.linearSlop) {
    this.m_uA.mul(1.0 / lengthA);
  } else {
    this.m_uA.setZero();
  }

  if (lengthB > 10.0 * Settings.linearSlop) {
    this.m_uB.mul(1.0 / lengthB);
  } else {
    this.m_uB.setZero();
  }

  // Compute effective mass.
  var ruA = Vec2.cross(this.m_rA, this.m_uA); // float
  var ruB = Vec2.cross(this.m_rB, this.m_uB); // float

  var mA = this.m_invMassA + this.m_invIA * ruA * ruA; // float
  var mB = this.m_invMassB + this.m_invIB * ruB * ruB; // float

  this.m_mass = mA + this.m_ratio * this.m_ratio * mB;

  if (this.m_mass > 0.0) {
    this.m_mass = 1.0 / this.m_mass;
  }

  if (step.warmStarting) {
    // Scale impulses to support variable time steps.
    this.m_impulse *= step.dtRatio;

    // Warm starting.
    var PA = Vec2.mul(-this.m_impulse, this.m_uA);
    var PB = Vec2.mul(-this.m_ratio * this.m_impulse, this.m_uB);

    vA.addMul(this.m_invMassA, PA);
    wA += this.m_invIA * Vec2.cross(this.m_rA, PA);

    vB.addMul(this.m_invMassB, PB);
    wB += this.m_invIB * Vec2.cross(this.m_rB, PB);

  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

PulleyJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var vpA = Vec2.add(vA, Vec2.cross(wA, this.m_rA));
  var vpB = Vec2.add(vB, Vec2.cross(wB, this.m_rB));

  var Cdot = -Vec2.dot(this.m_uA, vpA) - this.m_ratio
      * Vec2.dot(this.m_uB, vpB); // float
  var impulse = -this.m_mass * Cdot; // float
  this.m_impulse += impulse;

  var PA = Vec2.mul(-impulse, this.m_uA); // Vec2
  var PB = Vec2.mul(-this.m_ratio * impulse, this.m_uB); // Vec2
  vA.addMul(this.m_invMassA, PA);
  wA += this.m_invIA * Vec2.cross(this.m_rA, PA);
  vB.addMul(this.m_invMassB, PB);
  wB += this.m_invIB * Vec2.cross(this.m_rB, PB);

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

PulleyJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA), qB = Rot.neo(aB);

  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // Get the pulley axes.
  var uA = Vec2.sub(Vec2.add(cA, this.m_rA), this.m_groundAnchorA);
  var uB = Vec2.sub(Vec2.add(cB, this.m_rB), this.m_groundAnchorB);

  var lengthA = uA.length();
  var lengthB = uB.length();

  if (lengthA > 10.0 * Settings.linearSlop) {
    uA.mul(1.0 / lengthA);
  } else {
    uA.setZero();
  }

  if (lengthB > 10.0 * Settings.linearSlop) {
    uB.mul(1.0 / lengthB);
  } else {
    uB.setZero();
  }

  // Compute effective mass.
  var ruA = Vec2.cross(rA, uA);
  var ruB = Vec2.cross(rB, uB);

  var mA = this.m_invMassA + this.m_invIA * ruA * ruA; // float
  var mB = this.m_invMassB + this.m_invIB * ruB * ruB; // float

  var mass = mA + this.m_ratio * this.m_ratio * mB; // float

  if (mass > 0.0) {
    mass = 1.0 / mass;
  }

  var C = this.m_constant - lengthA - this.m_ratio * lengthB; // float
  var linearError = Math.abs(C); // float

  var impulse = -mass * C; // float

  var PA = Vec2.mul(-impulse, uA); // Vec2
  var PB = Vec2.mul(-this.m_ratio * impulse, uB); // Vec2

  cA.addMul(this.m_invMassA, PA);
  aA += this.m_invIA * Vec2.cross(rA, PA);
  cB.addMul(this.m_invMassB, PB);
  aB += this.m_invIB * Vec2.cross(rB, PB);

  this.m_bodyA.c_position.c = cA;
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c = cB;
  this.m_bodyB.c_position.a = aB;

  return linearError < Settings.linearSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/RevoluteJoint.js":
/*!***************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/RevoluteJoint.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = RevoluteJoint;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

var inactiveLimit = 0;
var atLowerLimit = 1;
var atUpperLimit = 2;
var equalLimits = 3;

RevoluteJoint.TYPE = 'revolute-joint';
Joint.TYPES[RevoluteJoint.TYPE] = RevoluteJoint;

RevoluteJoint._super = Joint;
RevoluteJoint.prototype = Object.create(RevoluteJoint._super.prototype);

/**
 * @typedef {Object} RevoluteJointDef
 *
 * Revolute joint definition. This requires defining an anchor point where the
 * bodies are joined. The definition uses local anchor points so that the
 * initial configuration can violate the constraint slightly. You also need to
 * specify the initial relative angle for joint limits. This helps when saving
 * and loading a game.
 *
 * The local anchor points are measured from the body's origin rather than the
 * center of mass because: 1. you might not know where the center of mass will
 * be. 2. if you add/remove shapes from a body and recompute the mass, the
 * joints will be broken.
 *
 * @prop {bool} enableLimit A flag to enable joint limits.
 * @prop {bool} enableMotor A flag to enable the joint motor.
 * @prop {float} lowerAngle The lower angle for the joint limit (radians).
 * @prop {float} upperAngle The upper angle for the joint limit (radians).
 * @prop {float} motorSpeed The desired motor speed. Usually in radians per
 *       second.
 * @prop {float} maxMotorTorque The maximum motor torque used to achieve the
 *       desired motor speed. Usually in N-m.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {float} referenceAngle The bodyB angle minus bodyA angle in the
 *       reference state (radians).
 */

var DEFAULTS = {
  lowerAngle : 0.0,
  upperAngle : 0.0,
  maxMotorTorque : 0.0,
  motorSpeed : 0.0,
  enableLimit : false,
  enableMotor : false
};

/**
 * A revolute joint constrains two bodies to share a common point while they are
 * free to rotate about the point. The relative rotation about the shared point
 * is the joint angle. You can limit the relative rotation with a joint limit
 * that specifies a lower and upper angle. You can use a motor to drive the
 * relative rotation about the shared point. A maximum motor torque is provided
 * so that infinite forces are not generated.
 *
 * @param {RevoluteJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function RevoluteJoint(def, bodyA, bodyB, anchor) {
  if (!(this instanceof RevoluteJoint)) {
    return new RevoluteJoint(def, bodyA, bodyB, anchor);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = RevoluteJoint.TYPE;

  this.m_localAnchorA =  Vec2.clone(anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB =  Vec2.clone(anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.zero());
  this.m_referenceAngle = Math.isFinite(def.referenceAngle) ? def.referenceAngle : bodyB.getAngle() - bodyA.getAngle();

  this.m_impulse = Vec3();
  this.m_motorImpulse = 0.0;

  this.m_lowerAngle = def.lowerAngle;
  this.m_upperAngle = def.upperAngle;
  this.m_maxMotorTorque = def.maxMotorTorque;
  this.m_motorSpeed = def.motorSpeed;
  this.m_enableLimit = def.enableLimit;
  this.m_enableMotor = def.enableMotor;

  // Solver temp
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  // effective mass for point-to-point constraint.
  this.m_mass = new Mat33();
  // effective mass for motor/limit angular constraint.
  this.m_motorMass; // float
  this.m_limitState = inactiveLimit;

  // Point-to-point constraint
  // C = p2 - p1
  // Cdot = v2 - v1
  // = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)

  // Motor constraint
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
}

RevoluteJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    lowerAngle: this.m_lowerAngle,
    upperAngle: this.m_upperAngle,
    maxMotorTorque: this.m_maxMotorTorque,
    motorSpeed: this.m_motorSpeed,
    enableLimit: this.m_enableLimit,
    enableMotor: this.m_enableMotor,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    referenceAngle: this.m_referenceAngle,
  };
};

RevoluteJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new RevoluteJoint(data);
  return joint;
};

/**
 * @internal
 */
RevoluteJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }
}

/**
 * The local anchor point relative to bodyA's origin.
 */
RevoluteJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
RevoluteJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * Get the reference angle.
 */
RevoluteJoint.prototype.getReferenceAngle = function() {
  return this.m_referenceAngle;
}

/**
 * Get the current joint angle in radians.
 */
RevoluteJoint.prototype.getJointAngle = function() {
  var bA = this.m_bodyA;
  var bB = this.m_bodyB;
  return bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
}

/**
 * Get the current joint angle speed in radians per second.
 */
RevoluteJoint.prototype.getJointSpeed = function() {
  var bA = this.m_bodyA;
  var bB = this.m_bodyB;
  return bB.m_angularVelocity - bA.m_angularVelocity;
}

/**
 * Is the joint motor enabled?
 */
RevoluteJoint.prototype.isMotorEnabled = function() {
  return this.m_enableMotor;
}

/**
 * Enable/disable the joint motor.
 */
RevoluteJoint.prototype.enableMotor = function(flag) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_enableMotor = flag;
}

/**
 * Get the current motor torque given the inverse time step. Unit is N*m.
 */
RevoluteJoint.prototype.getMotorTorque = function(inv_dt) {
  return inv_dt * this.m_motorImpulse;
}

/**
 * Set the motor speed in radians per second.
 */
RevoluteJoint.prototype.setMotorSpeed = function(speed) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_motorSpeed = speed;
}

/**
 * Get the motor speed in radians per second.
 */
RevoluteJoint.prototype.getMotorSpeed = function() {
  return this.m_motorSpeed;
}

/**
 * Set the maximum motor torque, usually in N-m.
 */
RevoluteJoint.prototype.setMaxMotorTorque = function(torque) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_maxMotorTorque = torque;
}

RevoluteJoint.prototype.getMaxMotorTorque = function() {
  return this.m_maxMotorTorque;
}

/**
 * Is the joint limit enabled?
 */
RevoluteJoint.prototype.isLimitEnabled = function() {
  return this.m_enableLimit;
}

/**
 * Enable/disable the joint limit.
 */
RevoluteJoint.prototype.enableLimit = function(flag) {
  if (flag != this.m_enableLimit) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_enableLimit = flag;
    this.m_impulse.z = 0.0;
  }
}

/**
 * Get the lower joint limit in radians.
 */
RevoluteJoint.prototype.getLowerLimit = function() {
  return this.m_lowerAngle;
}

/**
 * Get the upper joint limit in radians.
 */
RevoluteJoint.prototype.getUpperLimit = function() {
  return this.m_upperAngle;
}

/**
 * Set the joint limits in radians.
 */
RevoluteJoint.prototype.setLimits = function(lower, upper) {
  _ASSERT && common.assert(lower <= upper);

  if (lower != this.m_lowerAngle || upper != this.m_upperAngle) {
    this.m_bodyA.setAwake(true);
    this.m_bodyB.setAwake(true);
    this.m_impulse.z = 0.0;
    this.m_lowerAngle = lower;
    this.m_upperAngle = upper;
  }
}

RevoluteJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

RevoluteJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

/**
 * Get the reaction force given the inverse time step. Unit is N.
 */
RevoluteJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.neo(this.m_impulse.x, this.m_impulse.y).mul(inv_dt);
}

/**
 * Get the reaction torque due to the joint limit given the inverse time step.
 * Unit is N*m.
 */
RevoluteJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_impulse.z;
}

RevoluteJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  this.m_rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // J = [-I -r1_skew I r2_skew]
  // [ 0 -1 0 1]
  // r_skew = [-ry; rx]

  // Matlab
  // K = [ mA+r1y^2*iA+mB+r2y^2*iB, -r1y*iA*r1x-r2y*iB*r2x, -r1y*iA-r2y*iB]
  // [ -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB, r1x*iA+r2x*iB]
  // [ -r1y*iA-r2y*iB, r1x*iA+r2x*iB, iA+iB]

  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  var fixedRotation = (iA + iB === 0.0); // bool

  this.m_mass.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y
      * this.m_rB.y * iB;
  this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y
      * this.m_rB.x * iB;
  this.m_mass.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
  this.m_mass.ex.y = this.m_mass.ey.x;
  this.m_mass.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x
      * this.m_rB.x * iB;
  this.m_mass.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
  this.m_mass.ex.z = this.m_mass.ez.x;
  this.m_mass.ey.z = this.m_mass.ez.y;
  this.m_mass.ez.z = iA + iB;

  this.m_motorMass = iA + iB;
  if (this.m_motorMass > 0.0) {
    this.m_motorMass = 1.0 / this.m_motorMass;
  }

  if (this.m_enableMotor == false || fixedRotation) {
    this.m_motorImpulse = 0.0;
  }

  if (this.m_enableLimit && fixedRotation == false) {
    var jointAngle = aB - aA - this.m_referenceAngle; // float

    if (Math.abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * Settings.angularSlop) {
      this.m_limitState = equalLimits;

    } else if (jointAngle <= this.m_lowerAngle) {
      if (this.m_limitState != atLowerLimit) {
        this.m_impulse.z = 0.0;
      }
      this.m_limitState = atLowerLimit;

    } else if (jointAngle >= this.m_upperAngle) {
      if (this.m_limitState != atUpperLimit) {
        this.m_impulse.z = 0.0;
      }
      this.m_limitState = atUpperLimit;

    } else {
      this.m_limitState = inactiveLimit;
      this.m_impulse.z = 0.0;
    }

  } else {
    this.m_limitState = inactiveLimit;
  }

  if (step.warmStarting) {
    // Scale impulses to support a variable time step.
    this.m_impulse.mul(step.dtRatio);
    this.m_motorImpulse *= step.dtRatio;

    var P = Vec2.neo(this.m_impulse.x, this.m_impulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + this.m_motorImpulse + this.m_impulse.z);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + this.m_motorImpulse + this.m_impulse.z);

  } else {
    this.m_impulse.setZero();
    this.m_motorImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

RevoluteJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  var fixedRotation = (iA + iB === 0.0); // bool

  // Solve motor constraint.
  if (this.m_enableMotor && this.m_limitState != equalLimits
      && fixedRotation == false) {
    var Cdot = wB - wA - this.m_motorSpeed; // float
    var impulse = -this.m_motorMass * Cdot; // float
    var oldImpulse = this.m_motorImpulse; // float
    var maxImpulse = step.dt * this.m_maxMotorTorque; // float
    this.m_motorImpulse = Math.clamp(this.m_motorImpulse + impulse,
        -maxImpulse, maxImpulse);
    impulse = this.m_motorImpulse - oldImpulse;

    wA -= iA * impulse;
    wB += iB * impulse;
  }

  // Solve limit constraint.
  if (this.m_enableLimit && this.m_limitState != inactiveLimit
      && fixedRotation == false) {
    var Cdot1 = Vec2.zero();
    Cdot1.addCombine(1, vB, 1, Vec2.cross(wB, this.m_rB));
    Cdot1.subCombine(1, vA, 1, Vec2.cross(wA, this.m_rA));
    var Cdot2 = wB - wA; // float
    var Cdot = Vec3(Cdot1.x, Cdot1.y, Cdot2);

    var impulse = Vec3.neg(this.m_mass.solve33(Cdot)); // Vec3

    if (this.m_limitState == equalLimits) {
      this.m_impulse.add(impulse);

    } else if (this.m_limitState == atLowerLimit) {
      var newImpulse = this.m_impulse.z + impulse.z; // float

      if (newImpulse < 0.0) {
        var rhs = Vec2.combine(-1, Cdot1, this.m_impulse.z, Vec2.neo(this.m_mass.ez.x, this.m_mass.ez.y)); // Vec2
        var reduced = this.m_mass.solve22(rhs); // Vec2
        impulse.x = reduced.x;
        impulse.y = reduced.y;
        impulse.z = -this.m_impulse.z;
        this.m_impulse.x += reduced.x;
        this.m_impulse.y += reduced.y;
        this.m_impulse.z = 0.0;

      } else {
        this.m_impulse.add(impulse);
      }

    } else if (this.m_limitState == atUpperLimit) {
      var newImpulse = this.m_impulse.z + impulse.z; // float

      if (newImpulse > 0.0) {
        var rhs = Vec2.combine(-1, Cdot1, this.m_impulse.z, Vec2.neo(this.m_mass.ez.x, this.m_mass.ez.y)); // Vec2
        var reduced = this.m_mass.solve22(rhs); // Vec2
        impulse.x = reduced.x;
        impulse.y = reduced.y;
        impulse.z = -this.m_impulse.z;
        this.m_impulse.x += reduced.x;
        this.m_impulse.y += reduced.y;
        this.m_impulse.z = 0.0;

      } else {
        this.m_impulse.add(impulse);
      }
    }

    var P = Vec2.neo(impulse.x, impulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + impulse.z);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + impulse.z);

  } else {
    // Solve point-to-point constraint
    var Cdot = Vec2.zero();
    Cdot.addCombine(1, vB, 1, Vec2.cross(wB, this.m_rB));
    Cdot.subCombine(1, vA, 1, Vec2.cross(wA, this.m_rA));
    var impulse = this.m_mass.solve22(Vec2.neg(Cdot)); // Vec2

    this.m_impulse.x += impulse.x;
    this.m_impulse.y += impulse.y;

    vA.subMul(mA, impulse);
    wA -= iA * Vec2.cross(this.m_rA, impulse);

    vB.addMul(mB, impulse);
    wB += iB * Vec2.cross(this.m_rB, impulse);
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

RevoluteJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  var angularError = 0.0; // float
  var positionError = 0.0; // float

  var fixedRotation = (this.m_invIA + this.m_invIB == 0.0); // bool

  // Solve angular limit constraint.
  if (this.m_enableLimit && this.m_limitState != inactiveLimit
      && fixedRotation == false) {
    var angle = aB - aA - this.m_referenceAngle; // float
    var limitImpulse = 0.0; // float

    if (this.m_limitState == equalLimits) {
      // Prevent large angular corrections
      var C = Math.clamp(angle - this.m_lowerAngle,
          -Settings.maxAngularCorrection, Settings.maxAngularCorrection); // float
      limitImpulse = -this.m_motorMass * C;
      angularError = Math.abs(C);

    } else if (this.m_limitState == atLowerLimit) {
      var C = angle - this.m_lowerAngle; // float
      angularError = -C;

      // Prevent large angular corrections and allow some slop.
      C = Math.clamp(C + Settings.angularSlop, -Settings.maxAngularCorrection,
          0.0);
      limitImpulse = -this.m_motorMass * C;

    } else if (this.m_limitState == atUpperLimit) {
      var C = angle - this.m_upperAngle; // float
      angularError = C;

      // Prevent large angular corrections and allow some slop.
      C = Math.clamp(C - Settings.angularSlop, 0.0,
          Settings.maxAngularCorrection);
      limitImpulse = -this.m_motorMass * C;
    }

    aA -= this.m_invIA * limitImpulse;
    aB += this.m_invIB * limitImpulse;
  }

  // Solve point-to-point constraint.
  {
    qA.set(aA);
    qB.set(aB);
    var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA)); // Vec2
    var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB)); // Vec2

    var C = Vec2.zero();
    C.addCombine(1, cB, 1, rB);
    C.subCombine(1, cA, 1, rA);
    positionError = C.length();

    var mA = this.m_invMassA;
    var mB = this.m_invMassB; // float
    var iA = this.m_invIA;
    var iB = this.m_invIB; // float

    var K = new Mat22();
    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
    K.ey.x = K.ex.y;
    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;

    var impulse = Vec2.neg(K.solve(C)); // Vec2

    cA.subMul(mA, impulse);
    aA -= iA * Vec2.cross(rA, impulse);

    cB.addMul(mB, impulse);
    aB += iB * Vec2.cross(rB, impulse);
  }

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;

  return positionError <= Settings.linearSlop
      && angularError <= Settings.angularSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/RopeJoint.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/RopeJoint.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = RopeJoint;

var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

var inactiveLimit = 0;
var atLowerLimit = 1;
var atUpperLimit = 2;
var equalLimits = 3;

RopeJoint.TYPE = 'rope-joint';
Joint.TYPES[RopeJoint.TYPE] = RopeJoint;

RopeJoint._super = Joint;
RopeJoint.prototype = Object.create(RopeJoint._super.prototype);

/**
 * @typedef {Object} RopeJointDef
 *
 * Rope joint definition. This requires two body anchor points and a maximum
 * lengths. Note: by default the connected objects will not collide. see
 * collideConnected in JointDef.
 *
 * @prop {float} maxLength The maximum length of the rope. Warning: this must be
 *       larger than linearSlop or the joint will have no effect.
 *
 * @prop {Vec2} def.localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} def.localAnchorB The local anchor point relative to bodyB's origin.
 */

var DEFAULTS = {
  maxLength : 0.0,
};

/**
 * A rope joint enforces a maximum distance between two points on two bodies. It
 * has no other effect.
 * 
 * Warning: if you attempt to change the maximum length during the simulation
 * you will get some non-physical behavior.
 * 
 * A model that would allow you to dynamically modify the length would have some
 * sponginess, so I chose not to implement it that way. See DistanceJoint if you
 * want to dynamically control length.
 *
 * @param {RopeJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function RopeJoint(def, bodyA, bodyB, anchor) {
  if (!(this instanceof RopeJoint)) {
    return new RopeJoint(def, bodyA, bodyB, anchor);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = RopeJoint.TYPE;
  this.m_localAnchorA = anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.neo(-1.0, 0.0);
  this.m_localAnchorB = anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.neo(1.0, 0.0);

  this.m_maxLength = def.maxLength;

  this.m_mass = 0.0;
  this.m_impulse = 0.0;
  this.m_length = 0.0;
  this.m_state = inactiveLimit;

  // Solver temp
  this.m_u; // Vec2
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_mass; // float

  // Limit:
  // C = norm(pB - pA) - L
  // u = (pB - pA) / norm(pB - pA)
  // Cdot = dot(u, vB + cross(wB, rB) - vA - cross(wA, rA))
  // J = [-u -cross(rA, u) u cross(rB, u)]
  // K = J * invM * JT
  // = invMassA + invIA * cross(rA, u)^2 + invMassB + invIB * cross(rB, u)^2
};

RopeJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    maxLength: this.m_maxLength,
  };
};

RopeJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new RopeJoint(data);
  return joint;
};

/**
 * The local anchor point relative to bodyA's origin.
 */
RopeJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
RopeJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * Set/Get the maximum length of the rope.
 */
RopeJoint.prototype.setMaxLength = function(length) {
  this.m_maxLength = length;
}

RopeJoint.prototype.getMaxLength = function() {
  return this.m_maxLength;
}

RopeJoint.prototype.getLimitState = function() {
  // TODO LimitState
  return this.m_state;
}

RopeJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

RopeJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

RopeJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.mul(this.m_impulse, this.m_u).mul(inv_dt);
}

RopeJoint.prototype.getReactionTorque = function(inv_dt) {
  return 0.0;
}

RopeJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  this.m_rA = Rot.mulSub(qA, this.m_localAnchorA, this.m_localCenterA);
  this.m_rB = Rot.mulSub(qB, this.m_localAnchorB, this.m_localCenterB);
  this.m_u = Vec2.zero();
  this.m_u.addCombine(1, cB, 1, this.m_rB);
  this.m_u.subCombine(1, cA, 1, this.m_rA); // Vec2

  this.m_length = this.m_u.length();

  var C = this.m_length - this.m_maxLength; // float
  if (C > 0.0) {
    this.m_state = atUpperLimit;
  } else {
    this.m_state = inactiveLimit;
  }

  if (this.m_length > Settings.linearSlop) {
    this.m_u.mul(1.0 / this.m_length);
  } else {
    this.m_u.setZero();
    this.m_mass = 0.0;
    this.m_impulse = 0.0;
    return;
  }

  // Compute effective mass.
  var crA = Vec2.cross(this.m_rA, this.m_u); // float
  var crB = Vec2.cross(this.m_rB, this.m_u); // float
  var invMass = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB
      + this.m_invIB * crB * crB; // float

  this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;

  if (step.warmStarting) {
    // Scale the impulse to support a variable time step.
    this.m_impulse *= step.dtRatio;

    var P = Vec2.mul(this.m_impulse, this.m_u);
    
    vA.subMul(this.m_invMassA, P);
    wA -= this.m_invIA * Vec2.cross(this.m_rA, P);
    
    vB.addMul(this.m_invMassB, P);
    wB += this.m_invIB * Vec2.cross(this.m_rB, P);
    
  } else {
    this.m_impulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

RopeJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  // Cdot = dot(u, v + cross(w, r))
  var vpA = Vec2.addCross(vA, wA, this.m_rA); // Vec2
  var vpB = Vec2.addCross(vB, wB, this.m_rB); // Vec2
  var C = this.m_length - this.m_maxLength; // float
  var Cdot = Vec2.dot(this.m_u, Vec2.sub(vpB, vpA)); // float

  // Predictive constraint.
  if (C < 0.0) {
    Cdot += step.inv_dt * C;
  }

  var impulse = -this.m_mass * Cdot; // float
  var oldImpulse = this.m_impulse; // float
  this.m_impulse = Math.min(0.0, this.m_impulse + impulse);
  impulse = this.m_impulse - oldImpulse;

  var P = Vec2.mul(impulse, this.m_u); // Vec2
  vA.subMul(this.m_invMassA, P);
  wA -= this.m_invIA * Vec2.cross(this.m_rA, P);
  vB.addMul(this.m_invMassB, P);
  wB += this.m_invIB * Vec2.cross(this.m_rB, P);

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

RopeJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c; // Vec2
  var aA = this.m_bodyA.c_position.a; // float
  var cB = this.m_bodyB.c_position.c; // Vec2
  var aB = this.m_bodyB.c_position.a; // float

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  var rA = Rot.mulSub(qA, this.m_localAnchorA, this.m_localCenterA);
  var rB = Rot.mulSub(qB, this.m_localAnchorB, this.m_localCenterB);
  var u = Vec2.zero();
  u.addCombine(1, cB, 1, rB);
  u.subCombine(1, cA, 1, rA); // Vec2

  var length = u.normalize(); // float
  var C = length - this.m_maxLength; // float

  C = Math.clamp(C, 0.0, Settings.maxLinearCorrection);

  var impulse = -this.m_mass * C; // float
  var P = Vec2.mul(impulse, u); // Vec2

  cA.subMul(this.m_invMassA, P);
  aA -= this.m_invIA * Vec2.cross(rA, P);
  cB.addMul(this.m_invMassB, P);
  aB += this.m_invIB * Vec2.cross(rB, P);

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;

  return length - this.m_maxLength < Settings.linearSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/WeldJoint.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/WeldJoint.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = WeldJoint;

var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

WeldJoint.TYPE = 'weld-joint';
Joint.TYPES[WeldJoint.TYPE] = WeldJoint;

WeldJoint._super = Joint;
WeldJoint.prototype = Object.create(WeldJoint._super.prototype);

/**
 * @typedef {Object} WeldJointDef
 *
 * Weld joint definition. You need to specify local anchor points where they are
 * attached and the relative body angle. The position of the anchor points is
 * important for computing the reaction torque.
 * 
 * @prop {float} frequencyHz The mass-spring-damper frequency in Hertz. Rotation
 *       only. Disable softness with a value of 0.
 * @prop {float} dampingRatio The damping ratio. 0 = no damping, 1 = critical
 *       damping.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {float} referenceAngle The bodyB angle minus bodyA angle in the
 *       reference state (radians).
 */
var DEFAULTS = {
  frequencyHz : 0.0,
  dampingRatio : 0.0,
}

/**
 * A weld joint essentially glues two bodies together. A weld joint may distort
 * somewhat because the island constraint solver is approximate.
 *
 * @param {WeldJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function WeldJoint(def, bodyA, bodyB, anchor) {
  if (!(this instanceof WeldJoint)) {
    return new WeldJoint(def, bodyA, bodyB, anchor);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = WeldJoint.TYPE;

  this.m_localAnchorA = Vec2.clone(anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB = Vec2.clone(anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.zero());
  this.m_referenceAngle = Math.isFinite(def.referenceAngle) ? def.referenceAngle : bodyB.getAngle() - bodyA.getAngle();

  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;

  this.m_impulse = Vec3();

  this.m_bias = 0.0;
  this.m_gamma = 0.0;

  // Solver temp
  this.m_rA; // Vec2
  this.m_rB; // Vec2
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float
  this.m_mass = new Mat33();

  // Point-to-point constraint
  // C = p2 - p1
  // Cdot = v2 - v1
  // / = v2 + cross(w2, r2) - v1 - cross(w1, r1)
  // J = [-I -r1_skew I r2_skew ]
  // Identity used:
  // w k % (rx i + ry j) = w * (-ry i + rx j)

  // Angle constraint
  // C = angle2 - angle1 - referenceAngle
  // Cdot = w2 - w1
  // J = [0 0 -1 0 0 1]
  // K = invI1 + invI2
}

WeldJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,
    
    frequencyHz: this.m_frequencyHz,
    dampingRatio: this.m_dampingRatio,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    referenceAngle: this.m_referenceAngle,
  };
};

WeldJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new WeldJoint(data);
  return joint;
};

/**
 * @internal
 */
WeldJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }
}

/**
 * The local anchor point relative to bodyA's origin.
 */
WeldJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
};

/**
 * The local anchor point relative to bodyB's origin.
 */
WeldJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
};

/**
 * Get the reference angle.
 */
WeldJoint.prototype.getReferenceAngle = function() {
  return this.m_referenceAngle;
};

/**
 * Set/get frequency in Hz.
 */
WeldJoint.prototype.setFrequency = function(hz) {
  this.m_frequencyHz = hz;
};

WeldJoint.prototype.getFrequency = function() {
  return this.m_frequencyHz;
};

/**
 * Set/get damping ratio.
 */
WeldJoint.prototype.setDampingRatio = function(ratio) {
  this.m_dampingRatio = ratio;
};

WeldJoint.prototype.getDampingRatio = function() {
  return this.m_dampingRatio;
};

WeldJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
};

WeldJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
};

WeldJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.neo(this.m_impulse.x, this.m_impulse.y).mul(inv_dt);
};

WeldJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_impulse.z;
};

WeldJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA), qB = Rot.neo(aB);

  this.m_rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  this.m_rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  // J = [-I -r1_skew I r2_skew]
  // [ 0 -1 0 1]
  // r_skew = [-ry; rx]

  // Matlab
  // K = [ mA+r1y^2*iA+mB+r2y^2*iB, -r1y*iA*r1x-r2y*iB*r2x, -r1y*iA-r2y*iB]
  // [ -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB, r1x*iA+r2x*iB]
  // [ -r1y*iA-r2y*iB, r1x*iA+r2x*iB, iA+iB]

  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  var K = new Mat33();
  K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y
      * iB;
  K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
  K.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
  K.ex.y = K.ey.x;
  K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x
      * iB;
  K.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
  K.ex.z = K.ez.x;
  K.ey.z = K.ez.y;
  K.ez.z = iA + iB;

  if (this.m_frequencyHz > 0.0) {
    K.getInverse22(this.m_mass);

    var invM = iA + iB; // float
    var m = invM > 0.0 ? 1.0 / invM : 0.0; // float

    var C = aB - aA - this.m_referenceAngle; // float

    // Frequency
    var omega = 2.0 * Math.PI * this.m_frequencyHz; // float

    // Damping coefficient
    var d = 2.0 * m * this.m_dampingRatio * omega; // float

    // Spring stiffness
    var k = m * omega * omega; // float

    // magic formulas
    var h = step.dt; // float
    this.m_gamma = h * (d + h * k);
    this.m_gamma = this.m_gamma != 0.0 ? 1.0 / this.m_gamma : 0.0;
    this.m_bias = C * h * k * this.m_gamma;

    invM += this.m_gamma;
    this.m_mass.ez.z = invM != 0.0 ? 1.0 / invM : 0.0;
  } else if (K.ez.z == 0.0) {
    K.getInverse22(this.m_mass);
    this.m_gamma = 0.0;
    this.m_bias = 0.0;
  } else {
    K.getSymInverse33(this.m_mass);
    this.m_gamma = 0.0;
    this.m_bias = 0.0;
  }

  if (step.warmStarting) {
    // Scale impulses to support a variable time step.
    this.m_impulse.mul(step.dtRatio);

    var P = Vec2.neo(this.m_impulse.x, this.m_impulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + this.m_impulse.z);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + this.m_impulse.z);

  } else {
    this.m_impulse.setZero();
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

WeldJoint.prototype.solveVelocityConstraints = function(step) {
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  if (this.m_frequencyHz > 0.0) {
    var Cdot2 = wB - wA; // float

    var impulse2 = -this.m_mass.ez.z
        * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z); // float
    this.m_impulse.z += impulse2;

    wA -= iA * impulse2;
    wB += iB * impulse2;

    var Cdot1 = Vec2.zero();
    Cdot1.addCombine(1, vB, 1, Vec2.cross(wB, this.m_rB));
    Cdot1.subCombine(1, vA, 1, Vec2.cross(wA, this.m_rA)); // Vec2

    var impulse1 = Vec2.neg(Mat33.mulVec2(this.m_mass, Cdot1)); // Vec2
    this.m_impulse.x += impulse1.x;
    this.m_impulse.y += impulse1.y;

    var P = Vec2.clone(impulse1); // Vec2

    vA.subMul(mA, P);
    wA -= iA * Vec2.cross(this.m_rA, P);

    vB.addMul(mB, P);
    wB += iB * Vec2.cross(this.m_rB, P);
  } else {
    var Cdot1 = Vec2.zero();
    Cdot1.addCombine(1, vB, 1, Vec2.cross(wB, this.m_rB));
    Cdot1.subCombine(1, vA, 1, Vec2.cross(wA, this.m_rA)); // Vec2
    var Cdot2 = wB - wA; // float
    var Cdot = Vec3(Cdot1.x, Cdot1.y, Cdot2); // Vec3

    var impulse = Vec3.neg(Mat33.mulVec3(this.m_mass, Cdot)); // Vec3
    this.m_impulse.add(impulse);

    var P = Vec2.neo(impulse.x, impulse.y);

    vA.subMul(mA, P);
    wA -= iA * (Vec2.cross(this.m_rA, P) + impulse.z);

    vB.addMul(mB, P);
    wB += iB * (Vec2.cross(this.m_rB, P) + impulse.z);
  }

  this.m_bodyA.c_velocity.v = vA;
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v = vB;
  this.m_bodyB.c_velocity.w = wB;
}

WeldJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA), qB = Rot.neo(aB);

  var mA = this.m_invMassA, mB = this.m_invMassB; // float
  var iA = this.m_invIA, iB = this.m_invIB; // float

  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));

  var positionError, angularError; // float

  var K = new Mat33();
  K.ex.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
  K.ey.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
  K.ez.x = -rA.y * iA - rB.y * iB;
  K.ex.y = K.ey.x;
  K.ey.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
  K.ez.y = rA.x * iA + rB.x * iB;
  K.ex.z = K.ez.x;
  K.ey.z = K.ez.y;
  K.ez.z = iA + iB;

  if (this.m_frequencyHz > 0.0) {
    var C1 = Vec2.zero();
    C1.addCombine(1, cB, 1, rB);
    C1.subCombine(1, cA, 1, rA); // Vec2

    positionError = C1.length();
    angularError = 0.0;

    var P = Vec2.neg(K.solve22(C1)); // Vec2

    cA.subMul(mA, P);
    aA -= iA * Vec2.cross(rA, P);

    cB.addMul(mB, P);
    aB += iB * Vec2.cross(rB, P);
  } else {
    var C1 = Vec2.zero();
    C1.addCombine(1, cB, 1, rB);
    C1.subCombine(1, cA, 1, rA);

    var C2 = aB - aA - this.m_referenceAngle; // float

    positionError = C1.length();
    angularError = Math.abs(C2);

    var C = Vec3(C1.x, C1.y, C2);

    var impulse = Vec3();
    if (K.ez.z > 0.0) {
      impulse = Vec3.neg(K.solve33(C));
    } else {
      var impulse2 = Vec2.neg(K.solve22(C1));
      impulse.set(impulse2.x, impulse2.y, 0.0);
    }

    var P = Vec2.neo(impulse.x, impulse.y);

    cA.subMul(mA, P);
    aA -= iA * (Vec2.cross(rA, P) + impulse.z);

    cB.addMul(mB, P);
    aB += iB * (Vec2.cross(rB, P) + impulse.z);
  }

  this.m_bodyA.c_position.c = cA;
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c = cB;
  this.m_bodyB.c_position.a = aB;

  return positionError <= Settings.linearSlop
      && angularError <= Settings.angularSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/joint/WheelJoint.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/joint/WheelJoint.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = WheelJoint;

var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");

var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");
var Mat22 = __webpack_require__(/*! ../common/Mat22 */ "../../node_modules/planck-js/lib/common/Mat22.js");
var Mat33 = __webpack_require__(/*! ../common/Mat33 */ "../../node_modules/planck-js/lib/common/Mat33.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Sweep = __webpack_require__(/*! ../common/Sweep */ "../../node_modules/planck-js/lib/common/Sweep.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Velocity = __webpack_require__(/*! ../common/Velocity */ "../../node_modules/planck-js/lib/common/Velocity.js");
var Position = __webpack_require__(/*! ../common/Position */ "../../node_modules/planck-js/lib/common/Position.js");

var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");

WheelJoint.TYPE = 'wheel-joint';
Joint.TYPES[WheelJoint.TYPE] = WheelJoint;

WheelJoint._super = Joint;
WheelJoint.prototype = Object.create(WheelJoint._super.prototype);

/**
 * @typedef {Object} WheelJointDef
 *
 * Wheel joint definition. This requires defining a line of motion using an axis
 * and an anchor point. The definition uses local anchor points and a local axis
 * so that the initial configuration can violate the constraint slightly. The
 * joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 *
 * @prop {boolean} enableMotor Enable/disable the joint motor.
 * @prop {float} maxMotorTorque The maximum motor torque, usually in N-m.
 * @prop {float} motorSpeed The desired motor speed in radians per second.
 * @prop {float} frequencyHz Suspension frequency, zero indicates no suspension.
 * @prop {float} dampingRatio Suspension damping ratio, one indicates critical
 *       damping.
 *
 * @prop {Vec2} localAnchorA The local anchor point relative to bodyA's origin.
 * @prop {Vec2} localAnchorB The local anchor point relative to bodyB's origin.
 * @prop {Vec2} localAxisA The local translation axis in bodyA.
 */
var DEFAULTS = {
  enableMotor : false,
  maxMotorTorque : 0.0,
  motorSpeed : 0.0,
  frequencyHz : 2.0,
  dampingRatio : 0.7,
};

/**
 * A wheel joint. This joint provides two degrees of freedom: translation along
 * an axis fixed in bodyA and rotation in the plane. In other words, it is a
 * point to line constraint with a rotational motor and a linear spring/damper.
 * This joint is designed for vehicle suspensions.
 *
 * @param {WheelJointDef} def
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function WheelJoint(def, bodyA, bodyB, anchor, axis) {
  if (!(this instanceof WheelJoint)) {
    return new WheelJoint(def, bodyA, bodyB, anchor, axis);
  }

  def = options(def, DEFAULTS);
  Joint.call(this, def, bodyA, bodyB);
  bodyA = this.m_bodyA;
  bodyB = this.m_bodyB;

  this.m_type = WheelJoint.TYPE;

  this.m_localAnchorA = Vec2.clone(anchor ? bodyA.getLocalPoint(anchor) : def.localAnchorA || Vec2.zero());
  this.m_localAnchorB = Vec2.clone(anchor ? bodyB.getLocalPoint(anchor) : def.localAnchorB || Vec2.zero());
  this.m_localXAxisA = Vec2.clone(axis ? bodyA.getLocalVector(axis) : def.localAxisA || def.localAxis || Vec2.neo(1.0, 0.0));
  this.m_localYAxisA = Vec2.cross(1.0, this.m_localXAxisA);

  this.m_mass = 0.0;
  this.m_impulse = 0.0;
  this.m_motorMass = 0.0;
  this.m_motorImpulse = 0.0;
  this.m_springMass = 0.0;
  this.m_springImpulse = 0.0;

  this.m_maxMotorTorque = def.maxMotorTorque;
  this.m_motorSpeed = def.motorSpeed;
  this.m_enableMotor = def.enableMotor;

  this.m_frequencyHz = def.frequencyHz;
  this.m_dampingRatio = def.dampingRatio;

  this.m_bias = 0.0;
  this.m_gamma = 0.0;

  // Solver temp
  this.m_localCenterA; // Vec2
  this.m_localCenterB; // Vec2
  this.m_invMassA; // float
  this.m_invMassB; // float
  this.m_invIA; // float
  this.m_invIB; // float

  this.m_ax = Vec2.zero();
  this.m_ay = Vec2.zero(); // Vec2
  this.m_sAx;
  this.m_sBx; // float
  this.m_sAy;
  this.m_sBy; // float

  // Linear constraint (point-to-line)
  // d = pB - pA = xB + rB - xA - rA
  // C = dot(ay, d)
  // Cdot = dot(d, cross(wA, ay)) + dot(ay, vB + cross(wB, rB) - vA - cross(wA,
  // rA))
  // = -dot(ay, vA) - dot(cross(d + rA, ay), wA) + dot(ay, vB) + dot(cross(rB,
  // ay), vB)
  // J = [-ay, -cross(d + rA, ay), ay, cross(rB, ay)]

  // Spring linear constraint
  // C = dot(ax, d)
  // Cdot = = -dot(ax, vA) - dot(cross(d + rA, ax), wA) + dot(ax, vB) +
  // dot(cross(rB, ax), vB)
  // J = [-ax -cross(d+rA, ax) ax cross(rB, ax)]

  // Motor rotational constraint
  // Cdot = wB - wA
  // J = [0 0 -1 0 0 1]
}

WheelJoint.prototype._serialize = function() {
  return {
    type: this.m_type,
    bodyA: this.m_bodyA,
    bodyB: this.m_bodyB,
    collideConnected: this.m_collideConnected,

    enableMotor: this.m_enableMotor,
    maxMotorTorque: this.m_maxMotorTorque,
    motorSpeed: this.m_motorSpeed,
    frequencyHz: this.m_frequencyHz,
    dampingRatio: this.m_dampingRatio,

    localAnchorA: this.m_localAnchorA,
    localAnchorB: this.m_localAnchorB,
    localAxisA: this.m_localXAxisA,
  };
};

WheelJoint._deserialize = function(data, world, restore) {
  data = Object.assign({}, data);
  data.bodyA = restore(Body, data.bodyA, world);
  data.bodyB = restore(Body, data.bodyB, world);
  var joint = new WheelJoint(data);
  return joint;
};

/**
 * @internal
 */
WheelJoint.prototype._setAnchors = function(def) {
  if (def.anchorA) {
    this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(def.anchorA));
  } else if (def.localAnchorA) {
    this.m_localAnchorA.set(def.localAnchorA);
  }

  if (def.anchorB) {
    this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(def.anchorB));
  } else if (def.localAnchorB) {
    this.m_localAnchorB.set(def.localAnchorB);
  }

  if (def.localAxisA) {
    this.m_localXAxisA.set(def.localAxisA);
    this.m_localYAxisA.set(Vec2.cross(1.0, def.localAxisA));
  }
}

/**
 * The local anchor point relative to bodyA's origin.
 */
WheelJoint.prototype.getLocalAnchorA = function() {
  return this.m_localAnchorA;
}

/**
 * The local anchor point relative to bodyB's origin.
 */
WheelJoint.prototype.getLocalAnchorB = function() {
  return this.m_localAnchorB;
}

/**
 * The local joint axis relative to bodyA.
 */
WheelJoint.prototype.getLocalAxisA = function() {
  return this.m_localXAxisA;
}

/**
 * Get the current joint translation, usually in meters.
 */
WheelJoint.prototype.getJointTranslation = function() {
  var bA = this.m_bodyA;
  var bB = this.m_bodyB;

  var pA = bA.getWorldPoint(this.m_localAnchorA); // Vec2
  var pB = bB.getWorldPoint(this.m_localAnchorB); // Vec2
  var d = Vec2.sub(pB, pA); // Vec2
  var axis = bA.getWorldVector(this.m_localXAxisA); // Vec2

  var translation = Vec2.dot(d, axis); // float
  return translation;
}

/**
 * Get the current joint translation speed, usually in meters per second.
 */
WheelJoint.prototype.getJointSpeed = function() {
  var wA = this.m_bodyA.m_angularVelocity;
  var wB = this.m_bodyB.m_angularVelocity;
  return wB - wA;
}

/**
 * Is the joint motor enabled?
 */
WheelJoint.prototype.isMotorEnabled = function() {
  return this.m_enableMotor;
}

/**
 * Enable/disable the joint motor.
 */
WheelJoint.prototype.enableMotor = function(flag) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_enableMotor = flag;
}

/**
 * Set the motor speed, usually in radians per second.
 */
WheelJoint.prototype.setMotorSpeed = function(speed) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_motorSpeed = speed;
}

/**
 * Get the motor speed, usually in radians per second.
 */
WheelJoint.prototype.getMotorSpeed = function() {
  return this.m_motorSpeed;
}

/**
 * Set/Get the maximum motor force, usually in N-m.
 */
WheelJoint.prototype.setMaxMotorTorque = function(torque) {
  this.m_bodyA.setAwake(true);
  this.m_bodyB.setAwake(true);
  this.m_maxMotorTorque = torque;
}

WheelJoint.prototype.getMaxMotorTorque = function() {
  return this.m_maxMotorTorque;
}

/**
 * Get the current motor torque given the inverse time step, usually in N-m.
 */
WheelJoint.prototype.getMotorTorque = function(inv_dt) {
  return inv_dt * this.m_motorImpulse;
}

/**
 * Set/Get the spring frequency in hertz. Setting the frequency to zero disables
 * the spring.
 */
WheelJoint.prototype.setSpringFrequencyHz = function(hz) {
  this.m_frequencyHz = hz;
}

WheelJoint.prototype.getSpringFrequencyHz = function() {
  return this.m_frequencyHz;
}

/**
 * Set/Get the spring damping ratio
 */
WheelJoint.prototype.setSpringDampingRatio = function(ratio) {
  this.m_dampingRatio = ratio;
}

WheelJoint.prototype.getSpringDampingRatio = function() {
  return this.m_dampingRatio;
}

WheelJoint.prototype.getAnchorA = function() {
  return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
}

WheelJoint.prototype.getAnchorB = function() {
  return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
}

WheelJoint.prototype.getReactionForce = function(inv_dt) {
  return Vec2.combine(this.m_impulse, this.m_ay, this.m_springImpulse, this.m_ax).mul(inv_dt);
}

WheelJoint.prototype.getReactionTorque = function(inv_dt) {
  return inv_dt * this.m_motorImpulse;
}

WheelJoint.prototype.initVelocityConstraints = function(step) {
  this.m_localCenterA = this.m_bodyA.m_sweep.localCenter;
  this.m_localCenterB = this.m_bodyB.m_sweep.localCenter;
  this.m_invMassA = this.m_bodyA.m_invMass;
  this.m_invMassB = this.m_bodyB.m_invMass;
  this.m_invIA = this.m_bodyA.m_invI;
  this.m_invIB = this.m_bodyB.m_invI;

  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;

  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  // Compute the effective masses.
  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));
  var d = Vec2.zero();
  d.addCombine(1, cB, 1, rB);
  d.subCombine(1, cA, 1, rA); // Vec2

  // Point to line constraint
  {
    this.m_ay = Rot.mulVec2(qA, this.m_localYAxisA);
    this.m_sAy = Vec2.cross(Vec2.add(d, rA), this.m_ay);
    this.m_sBy = Vec2.cross(rB, this.m_ay);

    this.m_mass = mA + mB + iA * this.m_sAy * this.m_sAy + iB * this.m_sBy
        * this.m_sBy;

    if (this.m_mass > 0.0) {
      this.m_mass = 1.0 / this.m_mass;
    }
  }

  // Spring constraint
  this.m_springMass = 0.0;
  this.m_bias = 0.0;
  this.m_gamma = 0.0;
  if (this.m_frequencyHz > 0.0) {
    this.m_ax = Rot.mulVec2(qA, this.m_localXAxisA);
    this.m_sAx = Vec2.cross(Vec2.add(d, rA), this.m_ax);
    this.m_sBx = Vec2.cross(rB, this.m_ax);

    var invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx
        * this.m_sBx; // float

    if (invMass > 0.0) {
      this.m_springMass = 1.0 / invMass;

      var C = Vec2.dot(d, this.m_ax); // float

      // Frequency
      var omega = 2.0 * Math.PI * this.m_frequencyHz; // float

      // Damping coefficient
      var d = 2.0 * this.m_springMass * this.m_dampingRatio * omega; // float

      // Spring stiffness
      var k = this.m_springMass * omega * omega; // float

      // magic formulas
      var h = step.dt; // float
      this.m_gamma = h * (d + h * k);
      if (this.m_gamma > 0.0) {
        this.m_gamma = 1.0 / this.m_gamma;
      }

      this.m_bias = C * h * k * this.m_gamma;

      this.m_springMass = invMass + this.m_gamma;
      if (this.m_springMass > 0.0) {
        this.m_springMass = 1.0 / this.m_springMass;
      }
    }
  } else {
    this.m_springImpulse = 0.0;
  }

  // Rotational motor
  if (this.m_enableMotor) {
    this.m_motorMass = iA + iB;
    if (this.m_motorMass > 0.0) {
      this.m_motorMass = 1.0 / this.m_motorMass;
    }
  } else {
    this.m_motorMass = 0.0;
    this.m_motorImpulse = 0.0;
  }

  if (step.warmStarting) {
    // Account for variable time step.
    this.m_impulse *= step.dtRatio;
    this.m_springImpulse *= step.dtRatio;
    this.m_motorImpulse *= step.dtRatio;

    var P = Vec2.combine(this.m_impulse, this.m_ay, this.m_springImpulse, this.m_ax);
    var LA = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse;
    var LB = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse;

    vA.subMul(this.m_invMassA, P);
    wA -= this.m_invIA * LA;

    vB.addMul(this.m_invMassB, P);
    wB += this.m_invIB * LB;

  } else {
    this.m_impulse = 0.0;
    this.m_springImpulse = 0.0;
    this.m_motorImpulse = 0.0;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

WheelJoint.prototype.solveVelocityConstraints = function(step) {
  var mA = this.m_invMassA;
  var mB = this.m_invMassB; // float
  var iA = this.m_invIA;
  var iB = this.m_invIB; // float

  var vA = this.m_bodyA.c_velocity.v;
  var wA = this.m_bodyA.c_velocity.w;
  var vB = this.m_bodyB.c_velocity.v;
  var wB = this.m_bodyB.c_velocity.w;

  // Solve spring constraint
  {
    var Cdot = Vec2.dot(this.m_ax, vB) - Vec2.dot(this.m_ax, vA) + this.m_sBx
        * wB - this.m_sAx * wA; // float
    var impulse = -this.m_springMass
        * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse); // float
    this.m_springImpulse += impulse;

    var P = Vec2.mul(impulse, this.m_ax); // Vec2
    var LA = impulse * this.m_sAx; // float
    var LB = impulse * this.m_sBx; // float

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  }

  // Solve rotational motor constraint
  {
    var Cdot = wB - wA - this.m_motorSpeed; // float
    var impulse = -this.m_motorMass * Cdot; // float

    var oldImpulse = this.m_motorImpulse; // float
    var maxImpulse = step.dt * this.m_maxMotorTorque; // float
    this.m_motorImpulse = Math.clamp(this.m_motorImpulse + impulse,
        -maxImpulse, maxImpulse);
    impulse = this.m_motorImpulse - oldImpulse;

    wA -= iA * impulse;
    wB += iB * impulse;
  }

  // Solve point to line constraint
  {
    var Cdot = Vec2.dot(this.m_ay, vB) - Vec2.dot(this.m_ay, vA) + this.m_sBy
        * wB - this.m_sAy * wA; // float
    var impulse = -this.m_mass * Cdot; // float
    this.m_impulse += impulse;

    var P = Vec2.mul(impulse, this.m_ay); // Vec2
    var LA = impulse * this.m_sAy; // float
    var LB = impulse * this.m_sBy; // float

    vA.subMul(mA, P);
    wA -= iA * LA;

    vB.addMul(mB, P);
    wB += iB * LB;
  }

  this.m_bodyA.c_velocity.v.set(vA);
  this.m_bodyA.c_velocity.w = wA;
  this.m_bodyB.c_velocity.v.set(vB);
  this.m_bodyB.c_velocity.w = wB;
}

WheelJoint.prototype.solvePositionConstraints = function(step) {
  var cA = this.m_bodyA.c_position.c;
  var aA = this.m_bodyA.c_position.a;
  var cB = this.m_bodyB.c_position.c;
  var aB = this.m_bodyB.c_position.a;

  var qA = Rot.neo(aA);
  var qB = Rot.neo(aB);

  var rA = Rot.mulVec2(qA, Vec2.sub(this.m_localAnchorA, this.m_localCenterA));
  var rB = Rot.mulVec2(qB, Vec2.sub(this.m_localAnchorB, this.m_localCenterB));
  var d = Vec2.zero();
  d.addCombine(1, cB, 1, rB);
  d.subCombine(1, cA, 1, rA);

  var ay = Rot.mulVec2(qA, this.m_localYAxisA);

  var sAy = Vec2.cross(Vec2.add(d, rA), ay); // float
  var sBy = Vec2.cross(rB, ay); // float

  var C = Vec2.dot(d, ay); // float

  var k = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy
      * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy; // float

  var impulse; // float
  if (k != 0.0) {
    impulse = -C / k;
  } else {
    impulse = 0.0;
  }

  var P = Vec2.mul(impulse, ay); // Vec2
  var LA = impulse * sAy; // float
  var LB = impulse * sBy; // float

  cA.subMul(this.m_invMassA, P);
  aA -= this.m_invIA * LA;
  cB.addMul(this.m_invMassB, P);
  aB += this.m_invIB * LB;

  this.m_bodyA.c_position.c.set(cA);
  this.m_bodyA.c_position.a = aA;
  this.m_bodyB.c_position.c.set(cB);
  this.m_bodyB.c_position.a = aB;

  return Math.abs(C) <= Settings.linearSlop;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/serializer/index.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/serializer/index.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var World = __webpack_require__(/*! ../World */ "../../node_modules/planck-js/lib/World.js");
var Body = __webpack_require__(/*! ../Body */ "../../node_modules/planck-js/lib/Body.js");
var Joint = __webpack_require__(/*! ../Joint */ "../../node_modules/planck-js/lib/Joint.js");
var Fixture = __webpack_require__(/*! ../Fixture */ "../../node_modules/planck-js/lib/Fixture.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Vec3 = __webpack_require__(/*! ../common/Vec3 */ "../../node_modules/planck-js/lib/common/Vec3.js");

var SID = 0;

function Serializer(opts) {
  opts = opts || {};

  var rootClass = opts.rootClass || World;

  var preSerialize = opts.preSerialize || function (obj) { return obj; };
  var postSerialize = opts.postSerialize || function (data, obj) { return data; };

  var preDeserialize = opts.preDeserialize || function (data) { return data; };
  var postDeserialize = opts.postDeserialize || function (obj, data) { return obj; };

  // This is used to create ref objects during serialize
  var refTypes = {
    'World': World,
    'Body': Body,
    'Joint': Joint,
    'Fixture': Fixture,
    'Shape': Shape,
  };

  // This is used by restore to deserialize objects and refs
  var restoreTypes = Object.assign({
    'Vec2': Vec2,
    'Vec3': Vec3,
  }, refTypes);

  this.toJson = function (root) {
    var json = [];

    var queue = [root];
    var refMap = {};

    function storeRef(value, typeName) {
      value.__sid = value.__sid || ++SID;
      if (!refMap[value.__sid]) {
        queue.push(value);
        var index = json.length + queue.length;
        var ref = {
          refIndex: index,
          refType: typeName
        };
        refMap[value.__sid] = ref;
      }
      return refMap[value.__sid];
    }

    function serialize(obj) {
      obj = preSerialize(obj);
      var data = obj._serialize();
      data = postSerialize(data, obj);
      return data;
    }

    function toJson(value, top) {
      if (typeof value !== 'object' || value === null) {
        return value;
      }
      if (typeof value._serialize === 'function') {
        if (value !== top) {
          for (var typeName in refTypes) {
            if (value instanceof refTypes[typeName]) {
              return storeRef(value, typeName);
            }
          }
        }
        value = serialize(value);
      }
      if (Array.isArray(value)) {
        var newValue = [];
        for (var key = 0; key < value.length; key++) {
          newValue[key] = toJson(value[key]);
        }
        value = newValue;

      } else {
        var newValue = {};
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            newValue[key] = toJson(value[key]);
          }
        }
        value = newValue;
      }
      return value;
    }

    while (queue.length) {
      var obj = queue.shift();
      var str = toJson(obj, obj);
      json.push(str);
    }

    return json;
  };

  this.fromJson = function (json) {
    var refMap = {};

    function deserialize(cls, data, ctx) {
      data = preDeserialize(data);
      var obj = cls._deserialize(data, ctx, restoreRef);
      obj = postDeserialize(obj, data);
      return obj;
    }

    function restoreRef(cls, ref, ctx) {
      if (!ref.refIndex) {
        return cls && cls._deserialize && deserialize(cls, ref, ctx);
      }
      cls = restoreTypes[ref.refType] || cls;
      var index = ref.refIndex;
      if (!refMap[index]) {
        var data = json[index];
        var obj = deserialize(cls, data, ctx);
        refMap[index] = obj;
      }
      return refMap[index];
    }

    var root = rootClass._deserialize(json[0], null, restoreRef);

    return root;
  }
}

module.exports = Serializer;

var serializer = new Serializer();
module.exports.toJson = serializer.toJson;
module.exports.fromJson = serializer.fromJson;


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/BoxShape.js":
/*!**********************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/BoxShape.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = BoxShape;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var PolygonShape = __webpack_require__(/*! ./PolygonShape */ "../../node_modules/planck-js/lib/shape/PolygonShape.js");

BoxShape._super = PolygonShape;
BoxShape.prototype = Object.create(BoxShape._super.prototype);

BoxShape.TYPE = 'polygon';

/**
 * A rectangle polygon which extend PolygonShape.
 */
function BoxShape(hx, hy, center, angle) {
  if (!(this instanceof BoxShape)) {
    return new BoxShape(hx, hy, center, angle);
  }

  BoxShape._super.call(this);

  this._setAsBox(hx, hy, center, angle);
}



/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/ChainShape.js":
/*!************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/ChainShape.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = ChainShape;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var EdgeShape = __webpack_require__(/*! ./EdgeShape */ "../../node_modules/planck-js/lib/shape/EdgeShape.js");

ChainShape._super = Shape;
ChainShape.prototype = Object.create(ChainShape._super.prototype);

ChainShape.TYPE = 'chain';
Shape.TYPES[ChainShape.TYPE] = ChainShape;

/**
 * A chain shape is a free form sequence of line segments. The chain has
 * two-sided collision, so you can use inside and outside collision. Therefore,
 * you may use any winding order. Connectivity information is used to create
 * smooth collisions.
 *
 * WARNING: The chain will not collide properly if there are self-intersections.
 */
function ChainShape(vertices, loop) {
  if (!(this instanceof ChainShape)) {
    return new ChainShape(vertices, loop);
  }

  ChainShape._super.call(this);

  this.m_type = ChainShape.TYPE;
  this.m_radius = Settings.polygonRadius;
  this.m_vertices = [];
  this.m_count = 0;
  this.m_prevVertex = null;
  this.m_nextVertex = null;
  this.m_hasPrevVertex = false;
  this.m_hasNextVertex = false;

  this.m_isLoop = loop;

  if (vertices && vertices.length) {
    if (loop) {
      this._createLoop(vertices);
    } else {
      this._createChain(vertices);
    }
  }
}

ChainShape.prototype._serialize = function() {
  const data = {
    type: this.m_type,
    vertices: this.m_vertices,
    isLoop: this.m_isLoop,
    hasPrevVertex: this.m_hasPrevVertex,
    hasNextVertex: this.m_hasNextVertex,
  };
  if (this.m_prevVertex) {
    data.prevVertex = this.m_prevVertex;
  }
  if (this.m_nextVertex) {
    data.nextVertex = this.m_nextVertex;
  }
  return data;
};

ChainShape._deserialize = function(data, fixture, restore) {
  var vertices = [];
  if (data.vertices) {
    for (var i = 0; i < data.vertices.length; i++) {
      vertices.push(restore(Vec2, data.vertices[i]));
    }
  }
  var shape = new ChainShape(vertices, data.isLoop);
  if (data.prevVertex) {
    shape.setPrevVertex(data.prevVertex);
  }
  if (data.nextVertex) {
    shape.setNextVertex(data.nextVertex);
  }
  return shape;
};

// ChainShape.clear = function() {
// this.m_vertices.length = 0;
// this.m_count = 0;
// }

/**
 * Create a loop. This automatically adjusts connectivity.
 *
 * @param vertices an array of vertices, these are copied
 * @param count the vertex count
 */
ChainShape.prototype._createLoop = function(vertices) {
  _ASSERT && common.assert(this.m_vertices.length == 0 && this.m_count == 0);
  _ASSERT && common.assert(vertices.length >= 3);
  for (var i = 1; i < vertices.length; ++i) {
    var v1 = vertices[i - 1];
    var v2 = vertices[i];
    // If the code crashes here, it means your vertices are too close together.
    _ASSERT && common.assert(Vec2.distanceSquared(v1, v2) > Settings.linearSlopSquared);
  }

  this.m_vertices = [];
  this.m_count = vertices.length + 1;
  for (var i = 0; i < vertices.length; ++i) {
    this.m_vertices[i] = Vec2.clone(vertices[i]);
  }
  this.m_vertices[vertices.length] = Vec2.clone(vertices[0]);

  this.m_prevVertex = this.m_vertices[this.m_count - 2];
  this.m_nextVertex = this.m_vertices[1];
  this.m_hasPrevVertex = true;
  this.m_hasNextVertex = true;
  return this;
}

/**
 * Create a chain with isolated end vertices.
 *
 * @param vertices an array of vertices, these are copied
 * @param count the vertex count
 */
ChainShape.prototype._createChain = function(vertices) {
  _ASSERT && common.assert(this.m_vertices.length == 0 && this.m_count == 0);
  _ASSERT && common.assert(vertices.length >= 2);
  for (var i = 1; i < vertices.length; ++i) {
    // If the code crashes here, it means your vertices are too close together.
    var v1 = vertices[i - 1];
    var v2 = vertices[i];
    _ASSERT && common.assert(Vec2.distanceSquared(v1, v2) > Settings.linearSlopSquared);
  }

  this.m_count = vertices.length;
  for (var i = 0; i < vertices.length; ++i) {
    this.m_vertices[i] = Vec2.clone(vertices[i]);
  }

  this.m_hasPrevVertex = false;
  this.m_hasNextVertex = false;
  this.m_prevVertex = null;
  this.m_nextVertex = null;
  return this;
}

ChainShape.prototype._reset = function() {
  if (this.m_isLoop) {
    this._createLoop(this.m_vertices);
  } else {
    this._createChain(this.m_vertices);
  }
}

/**
 * Establish connectivity to a vertex that precedes the first vertex. Don't call
 * this for loops.
 */
ChainShape.prototype.setPrevVertex = function(prevVertex) {
  this.m_prevVertex = prevVertex;
  this.m_hasPrevVertex = true;
}

/**
 * Establish connectivity to a vertex that follows the last vertex. Don't call
 * this for loops.
 */
ChainShape.prototype.setNextVertex = function(nextVertex) {
  this.m_nextVertex = nextVertex;
  this.m_hasNextVertex = true;
}

/**
 * @deprecated
 */
ChainShape.prototype._clone = function() {
  var clone = new ChainShape();
  clone.createChain(this.m_vertices);
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_prevVertex = this.m_prevVertex;
  clone.m_nextVertex = this.m_nextVertex;
  clone.m_hasPrevVertex = this.m_hasPrevVertex;
  clone.m_hasNextVertex = this.m_hasNextVertex;
  return clone;
}

ChainShape.prototype.getChildCount = function() {
  // edge count = vertex count - 1
  return this.m_count - 1;
}

// Get a child edge.
ChainShape.prototype.getChildEdge = function(edge, childIndex) {
  _ASSERT && common.assert(0 <= childIndex && childIndex < this.m_count - 1);
  edge.m_type = EdgeShape.TYPE;
  edge.m_radius = this.m_radius;

  edge.m_vertex1 = this.m_vertices[childIndex];
  edge.m_vertex2 = this.m_vertices[childIndex + 1];

  if (childIndex > 0) {
    edge.m_vertex0 = this.m_vertices[childIndex - 1];
    edge.m_hasVertex0 = true;
  } else {
    edge.m_vertex0 = this.m_prevVertex;
    edge.m_hasVertex0 = this.m_hasPrevVertex;
  }

  if (childIndex < this.m_count - 2) {
    edge.m_vertex3 = this.m_vertices[childIndex + 2];
    edge.m_hasVertex3 = true;
  } else {
    edge.m_vertex3 = this.m_nextVertex;
    edge.m_hasVertex3 = this.m_hasNextVertex;
  }
}

ChainShape.prototype.getVertex = function(index) {
  _ASSERT && common.assert(0 <= index && index <= this.m_count);
  if (index < this.m_count) {
    return this.m_vertices[index];
  } else {
    return this.m_vertices[0];
  }
}

/**
 * This always return false.
 */
ChainShape.prototype.testPoint = function(xf, p) {
  return false;
}

ChainShape.prototype.rayCast = function(output, input, xf, childIndex) {
  _ASSERT && common.assert(0 <= childIndex && childIndex < this.m_count);

  var edgeShape = new EdgeShape(this.getVertex(childIndex), this.getVertex(childIndex + 1));
  return edgeShape.rayCast(output, input, xf, 0);
}

ChainShape.prototype.computeAABB = function(aabb, xf, childIndex) {
  _ASSERT && common.assert(0 <= childIndex && childIndex < this.m_count);

  var v1 = Transform.mulVec2(xf, this.getVertex(childIndex));
  var v2 = Transform.mulVec2(xf, this.getVertex(childIndex + 1));

  aabb.combinePoints(v1, v2);
}

/**
 * Chains have zero mass.
 */
ChainShape.prototype.computeMass = function(massData, density) {
  massData.mass = 0.0;
  massData.center = Vec2.neo();
  massData.I = 0.0;
}

ChainShape.prototype.computeDistanceProxy = function(proxy, childIndex) {
  _ASSERT && common.assert(0 <= childIndex && childIndex < this.m_count);
  proxy.m_buffer[0] = this.getVertex(childIndex);
  proxy.m_buffer[1] = this.getVertex(childIndex + 1);
  proxy.m_vertices = proxy.m_buffer;
  proxy.m_count = 2;
  proxy.m_radius = this.m_radius;
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CircleShape.js":
/*!*************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CircleShape.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = CircleShape;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");

CircleShape._super = Shape;
CircleShape.prototype = Object.create(CircleShape._super.prototype);

CircleShape.TYPE = 'circle';
Shape.TYPES[CircleShape.TYPE] = CircleShape;

function CircleShape(a, b) {
  if (!(this instanceof CircleShape)) {
    return new CircleShape(a, b);
  }

  CircleShape._super.call(this);

  this.m_type = CircleShape.TYPE;
  this.m_p = Vec2.zero();
  this.m_radius = 1;

  if (typeof a === 'object' && Vec2.isValid(a)) {
    this.m_p.set(a);

    if (typeof b === 'number') {
      this.m_radius = b;
    }

  } else if (typeof a === 'number') {
    this.m_radius = a;
  }
}

CircleShape.prototype._serialize = function() {
  return {
    type: this.m_type,

    p: this.m_p,
    radius: this.m_radius,
  };
};

CircleShape._deserialize = function(data) {
  return new CircleShape(data.p, data.radius);
};

CircleShape.prototype.getRadius = function() {
  return this.m_radius;
}

CircleShape.prototype.getCenter = function() {
  return this.m_p;
}

CircleShape.prototype.getVertex = function(index) {
  _ASSERT && common.assert(index == 0);
  return this.m_p;
}

CircleShape.prototype.getVertexCount = function(index) {
  return 1;
}

/**
 * @deprecated
 */
CircleShape.prototype._clone = function() {
  var clone = new CircleShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_p = this.m_p.clone();
  return clone;
}

CircleShape.prototype.getChildCount = function() {
  return 1;
}

CircleShape.prototype.testPoint = function(xf, p) {
  var center = Vec2.add(xf.p, Rot.mulVec2(xf.q, this.m_p));
  var d = Vec2.sub(p, center);
  return Vec2.dot(d, d) <= this.m_radius * this.m_radius;
}

// Collision Detection in Interactive 3D Environments by Gino van den Bergen
// From Section 3.1.2
// x = s + a * r
// norm(x) = radius
CircleShape.prototype.rayCast = function(output, input, xf, childIndex) {

  var position = Vec2.add(xf.p, Rot.mulVec2(xf.q, this.m_p));
  var s = Vec2.sub(input.p1, position);
  var b = Vec2.dot(s, s) - this.m_radius * this.m_radius;

  // Solve quadratic equation.
  var r = Vec2.sub(input.p2, input.p1);
  var c = Vec2.dot(s, r);
  var rr = Vec2.dot(r, r);
  var sigma = c * c - rr * b;

  // Check for negative discriminant and short segment.
  if (sigma < 0.0 || rr < Math.EPSILON) {
    return false;
  }

  // Find the point of intersection of the line with the circle.
  var a = -(c + Math.sqrt(sigma));

  // Is the intersection point on the segment?
  if (0.0 <= a && a <= input.maxFraction * rr) {
    a /= rr;
    output.fraction = a;
    output.normal = Vec2.add(s, Vec2.mul(a, r));
    output.normal.normalize();
    return true;
  }

  return false;
}

CircleShape.prototype.computeAABB = function(aabb, xf, childIndex) {
  var p = Vec2.add(xf.p, Rot.mulVec2(xf.q, this.m_p));
  aabb.lowerBound.set(p.x - this.m_radius, p.y - this.m_radius);
  aabb.upperBound.set(p.x + this.m_radius, p.y + this.m_radius);
}

CircleShape.prototype.computeMass = function(massData, density) {
  massData.mass = density * Math.PI * this.m_radius * this.m_radius;
  massData.center = this.m_p;
  // inertia about the local origin
  massData.I = massData.mass
      * (0.5 * this.m_radius * this.m_radius + Vec2.dot(this.m_p, this.m_p));
}

CircleShape.prototype.computeDistanceProxy = function(proxy) {
  proxy.m_vertices.push(this.m_p);
  proxy.m_count = 1;
  proxy.m_radius = this.m_radius;
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CollideCircle.js":
/*!***************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CollideCircle.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var Contact = __webpack_require__(/*! ../Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Manifold = __webpack_require__(/*! ../Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var CircleShape = __webpack_require__(/*! ./CircleShape */ "../../node_modules/planck-js/lib/shape/CircleShape.js");

Contact.addType(CircleShape.TYPE, CircleShape.TYPE, CircleCircleContact);

function CircleCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == CircleShape.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == CircleShape.TYPE);
  CollideCircles(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

function CollideCircles(manifold, circleA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  var pA = Transform.mulVec2(xfA, circleA.m_p);
  var pB = Transform.mulVec2(xfB, circleB.m_p);

  var distSqr = Vec2.distanceSquared(pB, pA);
  var rA = circleA.m_radius;
  var rB = circleB.m_radius;
  var radius = rA + rB;
  if (distSqr > radius * radius) {
    return;
  }

  manifold.type = Manifold.e_circles;
  manifold.localPoint.set(circleA.m_p);
  manifold.localNormal.setZero();
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = Manifold.e_vertex;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = Manifold.e_vertex;
}

exports.CollideCircles = CollideCircles;


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CollideCirclePolygone.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CollideCirclePolygone.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Manifold = __webpack_require__(/*! ../Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var Contact = __webpack_require__(/*! ../Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var CircleShape = __webpack_require__(/*! ./CircleShape */ "../../node_modules/planck-js/lib/shape/CircleShape.js");
var PolygonShape = __webpack_require__(/*! ./PolygonShape */ "../../node_modules/planck-js/lib/shape/PolygonShape.js");

Contact.addType(PolygonShape.TYPE, CircleShape.TYPE, PolygonCircleContact);

function PolygonCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == PolygonShape.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == CircleShape.TYPE);
  CollidePolygonCircle(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(),
      xfB);
}

function CollidePolygonCircle(manifold, polygonA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle position in the frame of the polygon.
  var c = Transform.mulVec2(xfB, circleB.m_p);
  var cLocal = Transform.mulTVec2(xfA, c);

  // Find the min separating edge.
  var normalIndex = 0;
  var separation = -Infinity;
  var radius = polygonA.m_radius + circleB.m_radius;
  var vertexCount = polygonA.m_count;
  var vertices = polygonA.m_vertices;
  var normals = polygonA.m_normals;

  for (var i = 0; i < vertexCount; ++i) {
    var s = Vec2.dot(normals[i], Vec2.sub(cLocal, vertices[i]));

    if (s > radius) {
      // Early out.
      return;
    }

    if (s > separation) {
      separation = s;
      normalIndex = i;
    }
  }

  // Vertices that subtend the incident face.
  var vertIndex1 = normalIndex;
  var vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
  var v1 = vertices[vertIndex1];
  var v2 = vertices[vertIndex2];

  // If the center is inside the polygon ...
  if (separation < Math.EPSILON) {
    manifold.pointCount = 1;
    manifold.type = Manifold.e_faceA;
    manifold.localNormal.set(normals[normalIndex]);
    manifold.localPoint.setCombine(0.5, v1, 0.5, v2);
    manifold.points[0].localPoint = circleB.m_p;

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
    return;
  }

  // Compute barycentric coordinates
  var u1 = Vec2.dot(Vec2.sub(cLocal, v1), Vec2.sub(v2, v1));
  var u2 = Vec2.dot(Vec2.sub(cLocal, v2), Vec2.sub(v1, v2));
  if (u1 <= 0.0) {
    if (Vec2.distanceSquared(cLocal, v1) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v1);
    manifold.localNormal.normalize();
    manifold.localPoint = v1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
  } else if (u2 <= 0.0) {
    if (Vec2.distanceSquared(cLocal, v2) > radius * radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold.e_faceA;
    manifold.localNormal.setCombine(1, cLocal, -1, v2);
    manifold.localNormal.normalize();
    manifold.localPoint.set(v2);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
  } else {
    var faceCenter = Vec2.mid(v1, v2);
    var separation = Vec2.dot(cLocal, normals[vertIndex1])
        - Vec2.dot(faceCenter, normals[vertIndex1]);
    if (separation > radius) {
      return;
    }

    manifold.pointCount = 1;
    manifold.type = Manifold.e_faceA;
    manifold.localNormal.set(normals[vertIndex1]);
    manifold.localPoint.set(faceCenter);
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
  }
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CollideEdgeCircle.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CollideEdgeCircle.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var Contact = __webpack_require__(/*! ../Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Manifold = __webpack_require__(/*! ../Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var EdgeShape = __webpack_require__(/*! ./EdgeShape */ "../../node_modules/planck-js/lib/shape/EdgeShape.js");
var ChainShape = __webpack_require__(/*! ./ChainShape */ "../../node_modules/planck-js/lib/shape/ChainShape.js");
var CircleShape = __webpack_require__(/*! ./CircleShape */ "../../node_modules/planck-js/lib/shape/CircleShape.js");

Contact.addType(EdgeShape.TYPE, CircleShape.TYPE, EdgeCircleContact);
Contact.addType(ChainShape.TYPE, CircleShape.TYPE, ChainCircleContact);

function EdgeCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB,
    indexB) {
  _ASSERT && common.assert(fixtureA.getType() == EdgeShape.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == CircleShape.TYPE);

  var shapeA = fixtureA.getShape();
  var shapeB = fixtureB.getShape();

  CollideEdgeCircle(manifold, shapeA, xfA, shapeB, xfB);
}

function ChainCircleContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB,
    indexB) {
  _ASSERT && common.assert(fixtureA.getType() == ChainShape.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == CircleShape.TYPE);

  var chain = fixtureA.getShape();
  var edge = new EdgeShape();
  chain.getChildEdge(edge, indexA);

  var shapeA = edge;
  var shapeB = fixtureB.getShape();

  CollideEdgeCircle(manifold, shapeA, xfA, shapeB, xfB);
}

// Compute contact points for edge versus circle.
// This accounts for edge connectivity.
function CollideEdgeCircle(manifold, edgeA, xfA, circleB, xfB) {
  manifold.pointCount = 0;

  // Compute circle in frame of edge
  var Q = Transform.mulTVec2(xfA, Transform.mulVec2(xfB, circleB.m_p));

  var A = edgeA.m_vertex1;
  var B = edgeA.m_vertex2;
  var e = Vec2.sub(B, A);

  // Barycentric coordinates
  var u = Vec2.dot(e, Vec2.sub(B, Q));
  var v = Vec2.dot(e, Vec2.sub(Q, A));

  var radius = edgeA.m_radius + circleB.m_radius;

  // Region A
  if (v <= 0.0) {
    var P = Vec2.clone(A);
    var d = Vec2.sub(Q, P);
    var dd = Vec2.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to A?
    if (edgeA.m_hasVertex0) {
      var A1 = edgeA.m_vertex0;
      var B1 = A;
      var e1 = Vec2.sub(B1, A1);
      var u1 = Vec2.dot(e1, Vec2.sub(B1, Q));

      // Is the circle in Region AB of the previous edge?
      if (u1 > 0.0) {
        return;
      }
    }

    manifold.type = Manifold.e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 0;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
    return;
  }

  // Region B
  if (u <= 0.0) {
    var P = Vec2.clone(B);
    var d = Vec2.sub(Q, P);
    var dd = Vec2.dot(d, d);
    if (dd > radius * radius) {
      return;
    }

    // Is there an edge connected to B?
    if (edgeA.m_hasVertex3) {
      var B2 = edgeA.m_vertex3;
      var A2 = B;
      var e2 = Vec2.sub(B2, A2);
      var v2 = Vec2.dot(e2, Vec2.sub(Q, A2));

      // Is the circle in Region AB of the next edge?
      if (v2 > 0.0) {
        return;
      }
    }

    manifold.type = Manifold.e_circles;
    manifold.localNormal.setZero();
    manifold.localPoint.set(P);
    manifold.pointCount = 1;
    manifold.points[0].localPoint.set(circleB.m_p);

    // manifold.points[0].id.key = 0;
    manifold.points[0].id.cf.indexA = 1;
    manifold.points[0].id.cf.typeA = Manifold.e_vertex;
    manifold.points[0].id.cf.indexB = 0;
    manifold.points[0].id.cf.typeB = Manifold.e_vertex;
    return;
  }

  // Region AB
  var den = Vec2.dot(e, e);
  _ASSERT && common.assert(den > 0.0);
  var P = Vec2.combine(u / den, A, v / den, B);
  var d = Vec2.sub(Q, P);
  var dd = Vec2.dot(d, d);
  if (dd > radius * radius) {
    return;
  }

  var n = Vec2.neo(-e.y, e.x);
  if (Vec2.dot(n, Vec2.sub(Q, A)) < 0.0) {
    n.set(-n.x, -n.y);
  }
  n.normalize();

  manifold.type = Manifold.e_faceA;
  manifold.localNormal = n;
  manifold.localPoint.set(A);
  manifold.pointCount = 1;
  manifold.points[0].localPoint.set(circleB.m_p);

  // manifold.points[0].id.key = 0;
  manifold.points[0].id.cf.indexA = 0;
  manifold.points[0].id.cf.typeA = Manifold.e_face;
  manifold.points[0].id.cf.indexB = 0;
  manifold.points[0].id.cf.typeB = Manifold.e_vertex;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CollideEdgePolygon.js":
/*!********************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CollideEdgePolygon.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var Contact = __webpack_require__(/*! ../Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Manifold = __webpack_require__(/*! ../Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var EdgeShape = __webpack_require__(/*! ./EdgeShape */ "../../node_modules/planck-js/lib/shape/EdgeShape.js");
var ChainShape = __webpack_require__(/*! ./ChainShape */ "../../node_modules/planck-js/lib/shape/ChainShape.js");
var PolygonShape = __webpack_require__(/*! ./PolygonShape */ "../../node_modules/planck-js/lib/shape/PolygonShape.js");

Contact.addType(EdgeShape.TYPE, PolygonShape.TYPE, EdgePolygonContact);
Contact.addType(ChainShape.TYPE, PolygonShape.TYPE, ChainPolygonContact);

function EdgePolygonContact(manifold, xfA, fA, indexA, xfB, fB, indexB) {
  _ASSERT && common.assert(fA.getType() == EdgeShape.TYPE);
  _ASSERT && common.assert(fB.getType() == PolygonShape.TYPE);

  CollideEdgePolygon(manifold, fA.getShape(), xfA, fB.getShape(), xfB);
}

function ChainPolygonContact(manifold, xfA, fA, indexA, xfB, fB, indexB) {
  _ASSERT && common.assert(fA.getType() == ChainShape.TYPE);
  _ASSERT && common.assert(fB.getType() == PolygonShape.TYPE);

  var chain = fA.getShape();
  var edge = new EdgeShape();
  chain.getChildEdge(edge, indexA);

  CollideEdgePolygon(manifold, edge, xfA, fB.getShape(), xfB);
}

// EPAxis Type
var e_unknown = -1;
var e_edgeA = 1;
var e_edgeB = 2;

// VertexType unused?
var e_isolated = 0;
var e_concave = 1;
var e_convex = 2;

// This structure is used to keep track of the best separating axis.
function EPAxis() {
  this.type; // Type
  this.index;
  this.separation;
};

// This holds polygon B expressed in frame A.
function TempPolygon() {
  this.vertices = []; // Vec2[Settings.maxPolygonVertices]
  this.normals = []; // Vec2[Settings.maxPolygonVertices];
  this.count = 0;
};

// Reference face used for clipping
function ReferenceFace() {
  this.i1, this.i2; // int
  this.v1, this.v2; // v
  this.normal = Vec2.zero();
  this.sideNormal1 = Vec2.zero();
  this.sideOffset1; // float
  this.sideNormal2 = Vec2.zero();
  this.sideOffset2; // float
};

// reused
var edgeAxis = new EPAxis();
var polygonAxis = new EPAxis();
var polygonBA = new TempPolygon();
var rf = new ReferenceFace();

/**
 * This function collides and edge and a polygon, taking into account edge
 * adjacency.
 */
function CollideEdgePolygon(manifold, edgeA, xfA, polygonB, xfB) {
  // Algorithm:
  // 1. Classify v1 and v2
  // 2. Classify polygon centroid as front or back
  // 3. Flip normal if necessary
  // 4. Initialize normal range to [-pi, pi] about face normal
  // 5. Adjust normal range according to adjacent edges
  // 6. Visit each separating axes, only accept axes within the range
  // 7. Return if _any_ axis indicates separation
  // 8. Clip

  var m_type1, m_type2; // VertexType unused?

  var xf = Transform.mulTXf(xfA, xfB);

  var centroidB = Transform.mulVec2(xf, polygonB.m_centroid);

  var v0 = edgeA.m_vertex0;
  var v1 = edgeA.m_vertex1;
  var v2 = edgeA.m_vertex2;
  var v3 = edgeA.m_vertex3;

  var hasVertex0 = edgeA.m_hasVertex0;
  var hasVertex3 = edgeA.m_hasVertex3;

  var edge1 = Vec2.sub(v2, v1);
  edge1.normalize();
  var normal1 = Vec2.neo(edge1.y, -edge1.x);
  var offset1 = Vec2.dot(normal1, Vec2.sub(centroidB, v1));
  var offset0 = 0.0;
  var offset2 = 0.0;
  var convex1 = false;
  var convex2 = false;

  // Is there a preceding edge?
  if (hasVertex0) {
    var edge0 = Vec2.sub(v1, v0);
    edge0.normalize();
    var normal0 = Vec2.neo(edge0.y, -edge0.x);
    convex1 = Vec2.cross(edge0, edge1) >= 0.0;
    offset0 = Vec2.dot(normal0, centroidB) - Vec2.dot(normal0, v0);
  }

  // Is there a following edge?
  if (hasVertex3) {
    var edge2 = Vec2.sub(v3, v2);
    edge2.normalize();
    var normal2 = Vec2.neo(edge2.y, -edge2.x);
    convex2 = Vec2.cross(edge1, edge2) > 0.0;
    offset2 = Vec2.dot(normal2, centroidB) - Vec2.dot(normal2, v2);
  }

  var front;
  var normal = Vec2.zero();
  var lowerLimit = Vec2.zero();
  var upperLimit = Vec2.zero();

  // Determine front or back collision. Determine collision normal limits.
  if (hasVertex0 && hasVertex3) {
    if (convex1 && convex2) {
      front = offset0 >= 0.0 || offset1 >= 0.0 || offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.setMul(-1, normal1);
      }
    } else if (convex1) {
      front = offset0 >= 0.0 || (offset1 >= 0.0 && offset2 >= 0.0);
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.setMul(-1, normal1);
      }
    } else if (convex2) {
      front = offset2 >= 0.0 || (offset0 >= 0.0 && offset1 >= 0.0);
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.setMul(-1, normal0);
      }
    } else {
      front = offset0 >= 0.0 && offset1 >= 0.0 && offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.setMul(-1, normal0);
      }
    }
  } else if (hasVertex0) {
    if (convex1) {
      front = offset0 >= 0.0 || offset1 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal0);
        upperLimit.setMul(-1, normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal1);
      }
    } else {
      front = offset0 >= 0.0 && offset1 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.set(normal1);
        upperLimit.setMul(-1, normal0);
      }
    }
  } else if (hasVertex3) {
    if (convex2) {
      front = offset1 >= 0.0 || offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal2);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal1);
      }
    } else {
      front = offset1 >= 0.0 && offset2 >= 0.0;
      if (front) {
        normal.set(normal1);
        lowerLimit.setMul(-1, normal1);
        upperLimit.set(normal1);
      } else {
        normal.setMul(-1, normal1);
        lowerLimit.setMul(-1, normal2);
        upperLimit.set(normal1);
      }
    }
  } else {
    front = offset1 >= 0.0;
    if (front) {
      normal.set(normal1);
      lowerLimit.setMul(-1, normal1);
      upperLimit.setMul(-1, normal1);
    } else {
      normal.setMul(-1, normal1);
      lowerLimit.set(normal1);
      upperLimit.set(normal1);
    }
  }

  // Get polygonB in frameA
  polygonBA.count = polygonB.m_count;
  for (var i = 0; i < polygonB.m_count; ++i) {
    polygonBA.vertices[i] = Transform.mulVec2(xf, polygonB.m_vertices[i]);
    polygonBA.normals[i] = Rot.mulVec2(xf.q, polygonB.m_normals[i]);
  }

  var radius = 2.0 * Settings.polygonRadius;

  manifold.pointCount = 0;

  { // ComputeEdgeSeparation
    edgeAxis.type = e_edgeA;
    edgeAxis.index = front ? 0 : 1;
    edgeAxis.separation = Infinity;

    for (var i = 0; i < polygonBA.count; ++i) {
      var s = Vec2.dot(normal, Vec2.sub(polygonBA.vertices[i], v1));
      if (s < edgeAxis.separation) {
        edgeAxis.separation = s;
      }
    }
  }

  // If no valid normal can be found than this edge should not collide.
  if (edgeAxis.type == e_unknown) {
    return;
  }

  if (edgeAxis.separation > radius) {
    return;
  }

  { // ComputePolygonSeparation
    polygonAxis.type = e_unknown;
    polygonAxis.index = -1;
    polygonAxis.separation = -Infinity;

    var perp = Vec2.neo(-normal.y, normal.x);

    for (var i = 0; i < polygonBA.count; ++i) {
      var n = Vec2.neg(polygonBA.normals[i]);

      var s1 = Vec2.dot(n, Vec2.sub(polygonBA.vertices[i], v1));
      var s2 = Vec2.dot(n, Vec2.sub(polygonBA.vertices[i], v2));
      var s = Math.min(s1, s2);

      if (s > radius) {
        // No collision
        polygonAxis.type = e_edgeB;
        polygonAxis.index = i;
        polygonAxis.separation = s;
        break;
      }

      // Adjacency
      if (Vec2.dot(n, perp) >= 0.0) {
        if (Vec2.dot(Vec2.sub(n, upperLimit), normal) < -Settings.angularSlop) {
          continue;
        }
      } else {
        if (Vec2.dot(Vec2.sub(n, lowerLimit), normal) < -Settings.angularSlop) {
          continue;
        }
      }

      if (s > polygonAxis.separation) {
        polygonAxis.type = e_edgeB;
        polygonAxis.index = i;
        polygonAxis.separation = s;
      }
    }
  }

  if (polygonAxis.type != e_unknown && polygonAxis.separation > radius) {
    return;
  }

  // Use hysteresis for jitter reduction.
  var k_relativeTol = 0.98;
  var k_absoluteTol = 0.001;

  var primaryAxis;
  if (polygonAxis.type == e_unknown) {
    primaryAxis = edgeAxis;
  } else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
    primaryAxis = polygonAxis;
  } else {
    primaryAxis = edgeAxis;
  }

  var ie = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];

  if (primaryAxis.type == e_edgeA) {
    manifold.type = Manifold.e_faceA;

    // Search for the polygon normal that is most anti-parallel to the edge
    // normal.
    var bestIndex = 0;
    var bestValue = Vec2.dot(normal, polygonBA.normals[0]);
    for (var i = 1; i < polygonBA.count; ++i) {
      var value = Vec2.dot(normal, polygonBA.normals[i]);
      if (value < bestValue) {
        bestValue = value;
        bestIndex = i;
      }
    }

    var i1 = bestIndex;
    var i2 = i1 + 1 < polygonBA.count ? i1 + 1 : 0;

    ie[0].v = polygonBA.vertices[i1];
    ie[0].id.cf.indexA = 0;
    ie[0].id.cf.indexB = i1;
    ie[0].id.cf.typeA = Manifold.e_face;
    ie[0].id.cf.typeB = Manifold.e_vertex;

    ie[1].v = polygonBA.vertices[i2];
    ie[1].id.cf.indexA = 0;
    ie[1].id.cf.indexB = i2;
    ie[1].id.cf.typeA = Manifold.e_face;
    ie[1].id.cf.typeB = Manifold.e_vertex;

    if (front) {
      rf.i1 = 0;
      rf.i2 = 1;
      rf.v1 = v1;
      rf.v2 = v2;
      rf.normal.set(normal1);
    } else {
      rf.i1 = 1;
      rf.i2 = 0;
      rf.v1 = v2;
      rf.v2 = v1;
      rf.normal.setMul(-1, normal1);
    }
  } else {
    manifold.type = Manifold.e_faceB;

    ie[0].v = v1;
    ie[0].id.cf.indexA = 0;
    ie[0].id.cf.indexB = primaryAxis.index;
    ie[0].id.cf.typeA = Manifold.e_vertex;
    ie[0].id.cf.typeB = Manifold.e_face;

    ie[1].v = v2;
    ie[1].id.cf.indexA = 0;
    ie[1].id.cf.indexB = primaryAxis.index;
    ie[1].id.cf.typeA = Manifold.e_vertex;
    ie[1].id.cf.typeB = Manifold.e_face;

    rf.i1 = primaryAxis.index;
    rf.i2 = rf.i1 + 1 < polygonBA.count ? rf.i1 + 1 : 0;
    rf.v1 = polygonBA.vertices[rf.i1];
    rf.v2 = polygonBA.vertices[rf.i2];
    rf.normal.set(polygonBA.normals[rf.i1]);
  }

  rf.sideNormal1.set(rf.normal.y, -rf.normal.x);
  rf.sideNormal2.setMul(-1, rf.sideNormal1);
  rf.sideOffset1 = Vec2.dot(rf.sideNormal1, rf.v1);
  rf.sideOffset2 = Vec2.dot(rf.sideNormal2, rf.v2);

  // Clip incident edge against extruded edge1 side edges.
  var clipPoints1 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  var clipPoints2 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];

  var np;

  // Clip to box side 1
  np = Manifold.clipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);

  if (np < Settings.maxManifoldPoints) {
    return;
  }

  // Clip to negative box side 1
  np = Manifold.clipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);

  if (np < Settings.maxManifoldPoints) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  if (primaryAxis.type == e_edgeA) {
    manifold.localNormal = Vec2.clone(rf.normal);
    manifold.localPoint = Vec2.clone(rf.v1);
  } else {
    manifold.localNormal = Vec2.clone(polygonB.m_normals[rf.i1]);
    manifold.localPoint = Vec2.clone(polygonB.m_vertices[rf.i1]);
  }

  var pointCount = 0;
  for (var i = 0; i < Settings.maxManifoldPoints; ++i) {
    var separation = Vec2.dot(rf.normal, Vec2.sub(clipPoints2[i].v, rf.v1));

    if (separation <= radius) {
      var cp = manifold.points[pointCount]; // ManifoldPoint

      if (primaryAxis.type == e_edgeA) {
        cp.localPoint = Transform.mulT(xf, clipPoints2[i].v);
        cp.id = clipPoints2[i].id;
      } else {
        cp.localPoint = clipPoints2[i].v;
        cp.id.cf.typeA = clipPoints2[i].id.cf.typeB;
        cp.id.cf.typeB = clipPoints2[i].id.cf.typeA;
        cp.id.cf.indexA = clipPoints2[i].id.cf.indexB;
        cp.id.cf.indexB = clipPoints2[i].id.cf.indexA;
      }

      ++pointCount;
    }
  }

  manifold.pointCount = pointCount;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/CollidePolygon.js":
/*!****************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/CollidePolygon.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Manifold = __webpack_require__(/*! ../Manifold */ "../../node_modules/planck-js/lib/Manifold.js");
var Contact = __webpack_require__(/*! ../Contact */ "../../node_modules/planck-js/lib/Contact.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var PolygonShape = __webpack_require__(/*! ./PolygonShape */ "../../node_modules/planck-js/lib/shape/PolygonShape.js");

module.exports = CollidePolygons;

Contact.addType(PolygonShape.TYPE, PolygonShape.TYPE, PolygonContact);

function PolygonContact(manifold, xfA, fixtureA, indexA, xfB, fixtureB, indexB) {
  _ASSERT && common.assert(fixtureA.getType() == PolygonShape.TYPE);
  _ASSERT && common.assert(fixtureB.getType() == PolygonShape.TYPE);
  CollidePolygons(manifold, fixtureA.getShape(), xfA, fixtureB.getShape(), xfB);
}

/**
 * Find the max separation between poly1 and poly2 using edge normals from
 * poly1.
 */
function FindMaxSeparation(poly1, xf1, poly2, xf2) {
  var count1 = poly1.m_count;
  var count2 = poly2.m_count;
  var n1s = poly1.m_normals;
  var v1s = poly1.m_vertices;
  var v2s = poly2.m_vertices;
  var xf = Transform.mulTXf(xf2, xf1);

  var bestIndex = 0;
  var maxSeparation = -Infinity;
  for (var i = 0; i < count1; ++i) {
    // Get poly1 normal in frame2.
    var n = Rot.mulVec2(xf.q, n1s[i]);
    var v1 = Transform.mulVec2(xf, v1s[i]);

    // Find deepest point for normal i.
    var si = Infinity;
    for (var j = 0; j < count2; ++j) {
      var sij = Vec2.dot(n, v2s[j]) - Vec2.dot(n, v1);
      if (sij < si) {
        si = sij;
      }
    }

    if (si > maxSeparation) {
      maxSeparation = si;
      bestIndex = i;
    }
  }

  // used to keep last FindMaxSeparation call values
  FindMaxSeparation._maxSeparation = maxSeparation;
  FindMaxSeparation._bestIndex = bestIndex;
}

/**
 * @param {ClipVertex[2]} c
 * @param {int} edge1
 */
function FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
  var normals1 = poly1.m_normals;

  var count2 = poly2.m_count;
  var vertices2 = poly2.m_vertices;
  var normals2 = poly2.m_normals;

  _ASSERT && common.assert(0 <= edge1 && edge1 < poly1.m_count);

  // Get the normal of the reference edge in poly2's frame.
  var normal1 = Rot.mulT(xf2.q, Rot.mulVec2(xf1.q, normals1[edge1]));

  // Find the incident edge on poly2.
  var index = 0;
  var minDot = Infinity;
  for (var i = 0; i < count2; ++i) {
    var dot = Vec2.dot(normal1, normals2[i]);
    if (dot < minDot) {
      minDot = dot;
      index = i;
    }
  }

  // Build the clip vertices for the incident edge.
  var i1 = index;
  var i2 = i1 + 1 < count2 ? i1 + 1 : 0;

  c[0].v = Transform.mulVec2(xf2, vertices2[i1]);
  c[0].id.cf.indexA = edge1;
  c[0].id.cf.indexB = i1;
  c[0].id.cf.typeA = Manifold.e_face;
  c[0].id.cf.typeB = Manifold.e_vertex;

  c[1].v = Transform.mulVec2(xf2, vertices2[i2]);
  c[1].id.cf.indexA = edge1;
  c[1].id.cf.indexB = i2;
  c[1].id.cf.typeA = Manifold.e_face;
  c[1].id.cf.typeB = Manifold.e_vertex;
}

/**
 * 
 * Find edge normal of max separation on A - return if separating axis is found<br>
 * Find edge normal of max separation on B - return if separation axis is found<br>
 * Choose reference edge as min(minA, minB)<br>
 * Find incident edge<br>
 * Clip
 * 
 * The normal points from 1 to 2
 */
function CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
  manifold.pointCount = 0;
  var totalRadius = polyA.m_radius + polyB.m_radius;

  FindMaxSeparation(polyA, xfA, polyB, xfB);
  var edgeA = FindMaxSeparation._bestIndex;
  var separationA = FindMaxSeparation._maxSeparation;
  if (separationA > totalRadius)
    return;

  FindMaxSeparation(polyB, xfB, polyA, xfA);
  var edgeB = FindMaxSeparation._bestIndex;
  var separationB = FindMaxSeparation._maxSeparation;
  if (separationB > totalRadius)
    return;

  var poly1; // reference polygon
  var poly2; // incident polygon
  var xf1;
  var xf2;
  var edge1; // reference edge
  var flip;
  var k_tol = 0.1 * Settings.linearSlop;

  if (separationB > separationA + k_tol) {
    poly1 = polyB;
    poly2 = polyA;
    xf1 = xfB;
    xf2 = xfA;
    edge1 = edgeB;
    manifold.type = Manifold.e_faceB;
    flip = 1;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    xf1 = xfA;
    xf2 = xfB;
    edge1 = edgeA;
    manifold.type = Manifold.e_faceA;
    flip = 0;
  }

  var incidentEdge = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

  var count1 = poly1.m_count;
  var vertices1 = poly1.m_vertices;

  var iv1 = edge1;
  var iv2 = edge1 + 1 < count1 ? edge1 + 1 : 0;

  var v11 = vertices1[iv1];
  var v12 = vertices1[iv2];

  var localTangent = Vec2.sub(v12, v11);
  localTangent.normalize();

  var localNormal = Vec2.cross(localTangent, 1.0);
  var planePoint = Vec2.combine(0.5, v11, 0.5, v12);

  var tangent = Rot.mulVec2(xf1.q, localTangent);
  var normal = Vec2.cross(tangent, 1.0);

  v11 = Transform.mulVec2(xf1, v11);
  v12 = Transform.mulVec2(xf1, v12);

  // Face offset.
  var frontOffset = Vec2.dot(normal, v11);

  // Side offsets, extended by polytope skin thickness.
  var sideOffset1 = -Vec2.dot(tangent, v11) + totalRadius;
  var sideOffset2 = Vec2.dot(tangent, v12) + totalRadius;

  // Clip incident edge against extruded edge1 side edges.
  var clipPoints1 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  var clipPoints2 = [ new Manifold.clipVertex(), new Manifold.clipVertex() ];
  var np;

  // Clip to box side 1
  np = Manifold.clipSegmentToLine(clipPoints1, incidentEdge, Vec2.neg(tangent),
      sideOffset1, iv1);

  if (np < 2) {
    return;
  }

  // Clip to negative box side 1
  np = Manifold.clipSegmentToLine(clipPoints2, clipPoints1, tangent,
      sideOffset2, iv2);

  if (np < 2) {
    return;
  }

  // Now clipPoints2 contains the clipped points.
  manifold.localNormal = localNormal;
  manifold.localPoint = planePoint;

  var pointCount = 0;
  for (var i = 0; i < clipPoints2.length/* maxManifoldPoints */; ++i) {
    var separation = Vec2.dot(normal, clipPoints2[i].v) - frontOffset;

    if (separation <= totalRadius) {
      var cp = manifold.points[pointCount]; // ManifoldPoint
      cp.localPoint.set(Transform.mulTVec2(xf2, clipPoints2[i].v));
      cp.id = clipPoints2[i].id;
      if (flip) {
        // Swap features
        var cf = cp.id.cf; // ContactFeature
        var indexA = cf.indexA;
        var indexB = cf.indexB;
        var typeA = cf.typeA;
        var typeB = cf.typeB;
        cf.indexA = indexB;
        cf.indexB = indexA;
        cf.typeA = typeB;
        cf.typeB = typeA;
      }
      ++pointCount;
    }
  }

  manifold.pointCount = pointCount;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/EdgeShape.js":
/*!***********************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/EdgeShape.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = EdgeShape;

var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");

EdgeShape._super = Shape;
EdgeShape.prototype = Object.create(EdgeShape._super.prototype);

EdgeShape.TYPE = 'edge';
Shape.TYPES[EdgeShape.TYPE] = EdgeShape;

/**
 * A line segment (edge) shape. These can be connected in chains or loops to
 * other edge shapes. The connectivity information is used to ensure correct
 * contact normals.
 */
function EdgeShape(v1, v2) {
  if (!(this instanceof EdgeShape)) {
    return new EdgeShape(v1, v2);
  }

  EdgeShape._super.call(this);

  this.m_type = EdgeShape.TYPE;
  this.m_radius = Settings.polygonRadius;

  // These are the edge vertices
  this.m_vertex1 = v1 ? Vec2.clone(v1) : Vec2.zero();
  this.m_vertex2 = v2 ? Vec2.clone(v2) : Vec2.zero();

  // Optional adjacent vertices. These are used for smooth collision.
  // Used by chain shape.
  this.m_vertex0 = Vec2.zero();
  this.m_vertex3 = Vec2.zero();
  this.m_hasVertex0 = false;
  this.m_hasVertex3 = false;
}

EdgeShape.prototype._serialize = function() {
  return {
    type: this.m_type,

    vertex1: this.m_vertex1,
    vertex2: this.m_vertex2,

    vertex0: this.m_vertex0,
    vertex3: this.m_vertex3,
    hasVertex0: this.m_hasVertex0,
    hasVertex3: this.m_hasVertex3,
  };
};

EdgeShape._deserialize = function(data) {
  var shape = new EdgeShape(data.vertex1, data.vertex2);
  if (shape.hasVertex0) {
    shape.setPrev(data.vertex0);
  }
  if (shape.hasVertex3) {
    shape.setNext(data.vertex3);
  }
  return shape;
};

EdgeShape.prototype.setNext = function(v3) {
  if (v3) {
    this.m_vertex3.set(v3);
    this.m_hasVertex3 = true;
  } else {
    this.m_vertex3.setZero();
    this.m_hasVertex3 = false;
  }
  return this;
};

EdgeShape.prototype.setPrev = function(v0) {
  if (v0) {
    this.m_vertex0.set(v0);
    this.m_hasVertex0 = true;
  } else {
    this.m_vertex0.setZero();
    this.m_hasVertex0 = false;
  }
  return this;
};

/**
 * Set this as an isolated edge.
 */
EdgeShape.prototype._set = function(v1, v2) {
  this.m_vertex1.set(v1);
  this.m_vertex2.set(v2);
  this.m_hasVertex0 = false;
  this.m_hasVertex3 = false;
  return this;
}

/**
 * @deprecated
 */
EdgeShape.prototype._clone = function() {
  var clone = new EdgeShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_vertex1.set(this.m_vertex1);
  clone.m_vertex2.set(this.m_vertex2);
  clone.m_vertex0.set(this.m_vertex0);
  clone.m_vertex3.set(this.m_vertex3);
  clone.m_hasVertex0 = this.m_hasVertex0;
  clone.m_hasVertex3 = this.m_hasVertex3;
  return clone;
}

EdgeShape.prototype.getChildCount = function() {
  return 1;
}

EdgeShape.prototype.testPoint = function(xf, p) {
  return false;
}

// p = p1 + t * d
// v = v1 + s * e
// p1 + t * d = v1 + s * e
// s * e - t * d = p1 - v1
EdgeShape.prototype.rayCast = function(output, input, xf, childIndex) {
  // NOT_USED(childIndex);

  // Put the ray into the edge's frame of reference.
  var p1 = Rot.mulTVec2(xf.q, Vec2.sub(input.p1, xf.p));
  var p2 = Rot.mulTVec2(xf.q, Vec2.sub(input.p2, xf.p));
  var d = Vec2.sub(p2, p1);

  var v1 = this.m_vertex1;
  var v2 = this.m_vertex2;
  var e = Vec2.sub(v2, v1);
  var normal = Vec2.neo(e.y, -e.x);
  normal.normalize();

  // q = p1 + t * d
  // dot(normal, q - v1) = 0
  // dot(normal, p1 - v1) + t * dot(normal, d) = 0
  var numerator = Vec2.dot(normal, Vec2.sub(v1, p1));
  var denominator = Vec2.dot(normal, d);

  if (denominator == 0.0) {
    return false;
  }

  var t = numerator / denominator;
  if (t < 0.0 || input.maxFraction < t) {
    return false;
  }

  var q = Vec2.add(p1, Vec2.mul(t, d));

  // q = v1 + s * r
  // s = dot(q - v1, r) / dot(r, r)
  var r = Vec2.sub(v2, v1);
  var rr = Vec2.dot(r, r);
  if (rr == 0.0) {
    return false;
  }

  var s = Vec2.dot(Vec2.sub(q, v1), r) / rr;
  if (s < 0.0 || 1.0 < s) {
    return false;
  }

  output.fraction = t;
  if (numerator > 0.0) {
    output.normal = Rot.mulVec2(xf.q, normal).neg();
  } else {
    output.normal = Rot.mulVec2(xf.q, normal);
  }
  return true;
}

EdgeShape.prototype.computeAABB = function(aabb, xf, childIndex) {
  var v1 = Transform.mulVec2(xf, this.m_vertex1);
  var v2 = Transform.mulVec2(xf, this.m_vertex2);

  aabb.combinePoints(v1, v2);
  aabb.extend(this.m_radius)
}

EdgeShape.prototype.computeMass = function(massData, density) {
  massData.mass = 0.0;
  massData.center.setCombine(0.5, this.m_vertex1, 0.5, this.m_vertex2);
  massData.I = 0.0;
}

EdgeShape.prototype.computeDistanceProxy = function(proxy) {
  proxy.m_vertices.push(this.m_vertex1);
  proxy.m_vertices.push(this.m_vertex2);
  proxy.m_count = 2;
  proxy.m_radius = this.m_radius;
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/shape/PolygonShape.js":
/*!**************************************************************!*\
  !*** ../../node_modules/planck-js/lib/shape/PolygonShape.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Planck.js
 * The MIT License
 * Copyright (c) 2021 Erin Catto, Ali Shakiba
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = PolygonShape;

var common = __webpack_require__(/*! ../util/common */ "../../node_modules/planck-js/lib/util/common.js");
var options = __webpack_require__(/*! ../util/options */ "../../node_modules/planck-js/lib/util/options.js");
var Math = __webpack_require__(/*! ../common/Math */ "../../node_modules/planck-js/lib/common/Math.js");
var Transform = __webpack_require__(/*! ../common/Transform */ "../../node_modules/planck-js/lib/common/Transform.js");
var Rot = __webpack_require__(/*! ../common/Rot */ "../../node_modules/planck-js/lib/common/Rot.js");
var Vec2 = __webpack_require__(/*! ../common/Vec2 */ "../../node_modules/planck-js/lib/common/Vec2.js");
var AABB = __webpack_require__(/*! ../collision/AABB */ "../../node_modules/planck-js/lib/collision/AABB.js");
var Settings = __webpack_require__(/*! ../Settings */ "../../node_modules/planck-js/lib/Settings.js");
var Shape = __webpack_require__(/*! ../Shape */ "../../node_modules/planck-js/lib/Shape.js");

PolygonShape._super = Shape;
PolygonShape.prototype = Object.create(PolygonShape._super.prototype);

PolygonShape.TYPE = 'polygon';
Shape.TYPES[PolygonShape.TYPE] = PolygonShape;

/**
 * A convex polygon. It is assumed that the interior of the polygon is to the
 * left of each edge. Polygons have a maximum number of vertices equal to
 * Settings.maxPolygonVertices. In most cases you should not need many vertices
 * for a convex polygon. extends Shape
 */
function PolygonShape(vertices) {
  if (!(this instanceof PolygonShape)) {
    return new PolygonShape(vertices);
  }

  PolygonShape._super.call(this);

  this.m_type = PolygonShape.TYPE;
  this.m_radius = Settings.polygonRadius;
  this.m_centroid = Vec2.zero();
  this.m_vertices = []; // Vec2[Settings.maxPolygonVertices]
  this.m_normals = []; // Vec2[Settings.maxPolygonVertices]
  this.m_count = 0;

  if (vertices && vertices.length) {
    this._set(vertices);
  }
}

PolygonShape.prototype._serialize = function() {
  return {
    type: this.m_type,

    vertices: this.m_vertices,
  };
};

PolygonShape._deserialize = function(data, fixture, restore) {
  var vertices = [];
  if (data.vertices) {
    for (var i = 0; i < data.vertices.length; i++) {
      vertices.push(restore(Vec2, data.vertices[i]));
    }
  }

  var shape = new PolygonShape(vertices);
  return shape;
};

PolygonShape.prototype.getVertex = function(index) {
  _ASSERT && common.assert(0 <= index && index < this.m_count);
  return this.m_vertices[index];
}

/**
 * @deprecated
 */
PolygonShape.prototype._clone = function() {
  var clone = new PolygonShape();
  clone.m_type = this.m_type;
  clone.m_radius = this.m_radius;
  clone.m_count = this.m_count;
  clone.m_centroid.set(this.m_centroid);
  for (var i = 0; i < this.m_count; i++) {
    clone.m_vertices.push(this.m_vertices[i].clone());
  }
  for (var i = 0; i < this.m_normals.length; i++) {
    clone.m_normals.push(this.m_normals[i].clone());
  }
  return clone;
}

PolygonShape.prototype.getChildCount = function() {
  return 1;
}

function ComputeCentroid(vs, count) {
  _ASSERT && common.assert(count >= 3);

  var c = Vec2.zero();
  var area = 0.0;

  // pRef is the reference point for forming triangles.
  // It's location doesn't change the result (except for rounding error).
  var pRef = Vec2.zero();
  if (false) { var i; }

  var inv3 = 1.0 / 3.0;

  for (var i = 0; i < count; ++i) {
    // Triangle vertices.
    var p1 = pRef;
    var p2 = vs[i];
    var p3 = i + 1 < count ? vs[i + 1] : vs[0];

    var e1 = Vec2.sub(p2, p1);
    var e2 = Vec2.sub(p3, p1);

    var D = Vec2.cross(e1, e2);

    var triangleArea = 0.5 * D;
    area += triangleArea;

    // Area weighted centroid
    c.addMul(triangleArea * inv3, p1);
    c.addMul(triangleArea * inv3, p2);
    c.addMul(triangleArea * inv3, p3);
  }

  // Centroid
  _ASSERT && common.assert(area > Math.EPSILON);
  c.mul(1.0 / area);
  return c;
}

PolygonShape.prototype._reset = function() {
  this._set(this.m_vertices)
}

/**
 * @private
 *
 * Create a convex hull from the given array of local points. The count must be
 * in the range [3, Settings.maxPolygonVertices].
 *
 * Warning: the points may be re-ordered, even if they form a convex polygon
 * Warning: collinear points are handled but not removed. Collinear points may
 * lead to poor stacking behavior.
 */
PolygonShape.prototype._set = function(vertices) {
  _ASSERT && common.assert(3 <= vertices.length && vertices.length <= Settings.maxPolygonVertices);
  if (vertices.length < 3) {
    this._setAsBox(1.0, 1.0);
    return;
  }

  var n = Math.min(vertices.length, Settings.maxPolygonVertices);

  // Perform welding and copy vertices into local buffer.
  var ps = []; // [Settings.maxPolygonVertices];
  for (var i = 0; i < n; ++i) {
    var v = vertices[i];

    var unique = true;
    for (var j = 0; j < ps.length; ++j) {
      if (Vec2.distanceSquared(v, ps[j]) < 0.25 * Settings.linearSlopSquared) {
        unique = false;
        break;
      }
    }

    if (unique) {
      ps.push(v);
    }
  }

  n = ps.length;
  if (n < 3) {
    // Polygon is degenerate.
    _ASSERT && common.assert(false);
    this._setAsBox(1.0, 1.0);
    return;
  }

  // Create the convex hull using the Gift wrapping algorithm
  // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm

  // Find the right most point on the hull (in case of multiple points bottom most is used)
  var i0 = 0;
  var x0 = ps[0].x;
  for (var i = 1; i < n; ++i) {
    var x = ps[i].x;
    if (x > x0 || (x === x0 && ps[i].y < ps[i0].y)) {
      i0 = i;
      x0 = x;
    }
  }

  var hull = []; // [Settings.maxPolygonVertices];
  var m = 0;
  var ih = i0;

  for (;;) {
    hull[m] = ih;

    var ie = 0;
    for (var j = 1; j < n; ++j) {
      if (ie === ih) {
        ie = j;
        continue;
      }

      var r = Vec2.sub(ps[ie], ps[hull[m]]);
      var v = Vec2.sub(ps[j], ps[hull[m]]);
      var c = Vec2.cross(r, v);
      // c < 0 means counter-clockwise wrapping, c > 0 means clockwise wrapping
      if (c < 0.0) {
        ie = j;
      }

      // Collinearity check
      if (c === 0.0 && v.lengthSquared() > r.lengthSquared()) {
        ie = j;
      }
    }

    ++m;
    ih = ie;

    if (ie === i0) {
      break;
    }
  }

  if (m < 3) {
    // Polygon is degenerate.
    _ASSERT && common.assert(false);
    this._setAsBox(1.0, 1.0);
    return;
  }

  this.m_count = m;

  // Copy vertices.
  this.m_vertices = [];
  for (var i = 0; i < m; ++i) {
    this.m_vertices[i] = ps[hull[i]];
  }

  // Compute normals. Ensure the edges have non-zero length.
  for (var i = 0; i < m; ++i) {
    var i1 = i;
    var i2 = i + 1 < m ? i + 1 : 0;
    var edge = Vec2.sub(this.m_vertices[i2], this.m_vertices[i1]);
    _ASSERT && common.assert(edge.lengthSquared() > Math.EPSILON * Math.EPSILON);
    this.m_normals[i] = Vec2.cross(edge, 1.0);
    this.m_normals[i].normalize();
  }

  // Compute the polygon centroid.
  this.m_centroid = ComputeCentroid(this.m_vertices, m);
}

/**
 * @private
 */
PolygonShape.prototype._setAsBox = function(hx, hy, center, angle) {
  // start with right-bottom, counter-clockwise, as in Gift wrapping algorithm in PolygonShape._set()
  this.m_vertices[0] = Vec2.neo(hx, -hy);
  this.m_vertices[1] = Vec2.neo(hx, hy);
  this.m_vertices[2] = Vec2.neo(-hx, hy);
  this.m_vertices[3] = Vec2.neo(-hx, -hy);

  this.m_normals[0] = Vec2.neo(1.0, 0.0);
  this.m_normals[1] = Vec2.neo(0.0, 1.0);
  this.m_normals[2] = Vec2.neo(-1.0, 0.0);
  this.m_normals[3] = Vec2.neo(0.0, -1.0);

  this.m_count = 4;

  if (Vec2.isValid(center)) {
    angle = angle || 0;

    this.m_centroid.set(center);

    var xf = Transform.identity();
    xf.p.set(center);
    xf.q.set(angle);

    // Transform vertices and normals.
    for (var i = 0; i < this.m_count; ++i) {
      this.m_vertices[i] = Transform.mulVec2(xf, this.m_vertices[i]);
      this.m_normals[i] = Rot.mulVec2(xf.q, this.m_normals[i]);
    }
  }
}

PolygonShape.prototype.testPoint = function(xf, p) {
  var pLocal = Rot.mulTVec2(xf.q, Vec2.sub(p, xf.p));

  for (var i = 0; i < this.m_count; ++i) {
    var dot = Vec2.dot(this.m_normals[i], Vec2.sub(pLocal, this.m_vertices[i]));
    if (dot > 0.0) {
      return false;
    }
  }

  return true;
}

PolygonShape.prototype.rayCast = function(output, input, xf, childIndex) {

  // Put the ray into the polygon's frame of reference.
  var p1 = Rot.mulTVec2(xf.q, Vec2.sub(input.p1, xf.p));
  var p2 = Rot.mulTVec2(xf.q, Vec2.sub(input.p2, xf.p));
  var d = Vec2.sub(p2, p1);

  var lower = 0.0;
  var upper = input.maxFraction;

  var index = -1;

  for (var i = 0; i < this.m_count; ++i) {
    // p = p1 + a * d
    // dot(normal, p - v) = 0
    // dot(normal, p1 - v) + a * dot(normal, d) = 0
    var numerator = Vec2.dot(this.m_normals[i], Vec2.sub(this.m_vertices[i], p1));
    var denominator = Vec2.dot(this.m_normals[i], d);

    if (denominator == 0.0) {
      if (numerator < 0.0) {
        return false;
      }
    } else {
      // Note: we want this predicate without division:
      // lower < numerator / denominator, where denominator < 0
      // Since denominator < 0, we have to flip the inequality:
      // lower < numerator / denominator <==> denominator * lower > numerator.
      if (denominator < 0.0 && numerator < lower * denominator) {
        // Increase lower.
        // The segment enters this half-space.
        lower = numerator / denominator;
        index = i;
      } else if (denominator > 0.0 && numerator < upper * denominator) {
        // Decrease upper.
        // The segment exits this half-space.
        upper = numerator / denominator;
      }
    }

    // The use of epsilon here causes the assert on lower to trip
    // in some cases. Apparently the use of epsilon was to make edge
    // shapes work, but now those are handled separately.
    // if (upper < lower - Math.EPSILON)
    if (upper < lower) {
      return false;
    }
  }

  _ASSERT && common.assert(0.0 <= lower && lower <= input.maxFraction);

  if (index >= 0) {
    output.fraction = lower;
    output.normal = Rot.mulVec2(xf.q, this.m_normals[index]);
    return true;
  }

  return false;
};

PolygonShape.prototype.computeAABB = function(aabb, xf, childIndex) {
  var minX = Infinity, minY = Infinity;
  var maxX = -Infinity, maxY = -Infinity;
  for (var i = 0; i < this.m_count; ++i) {
    var v = Transform.mulVec2(xf, this.m_vertices[i]);
    minX = Math.min(minX, v.x);
    maxX = Math.max(maxX, v.x);
    minY = Math.min(minY, v.y);
    maxY = Math.max(maxY, v.y);
  }

  aabb.lowerBound.set(minX, minY);
  aabb.upperBound.set(maxX, maxY);
  aabb.extend(this.m_radius);
}

PolygonShape.prototype.computeMass = function(massData, density) {
  // Polygon mass, centroid, and inertia.
  // Let rho be the polygon density in mass per unit area.
  // Then:
  // mass = rho * int(dA)
  // centroid.x = (1/mass) * rho * int(x * dA)
  // centroid.y = (1/mass) * rho * int(y * dA)
  // I = rho * int((x*x + y*y) * dA)
  //
  // We can compute these integrals by summing all the integrals
  // for each triangle of the polygon. To evaluate the integral
  // for a single triangle, we make a change of variables to
  // the (u,v) coordinates of the triangle:
  // x = x0 + e1x * u + e2x * v
  // y = y0 + e1y * u + e2y * v
  // where 0 <= u && 0 <= v && u + v <= 1.
  //
  // We integrate u from [0,1-v] and then v from [0,1].
  // We also need to use the Jacobian of the transformation:
  // D = cross(e1, e2)
  //
  // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
  //
  // The rest of the derivation is handled by computer algebra.

  _ASSERT && common.assert(this.m_count >= 3);

  var center = Vec2.zero();
  var area = 0.0;
  var I = 0.0;

  // s is the reference point for forming triangles.
  // It's location doesn't change the result (except for rounding error).
  var s = Vec2.zero();

  // This code would put the reference point inside the polygon.
  for (var i = 0; i < this.m_count; ++i) {
    s.add(this.m_vertices[i]);
  }
  s.mul(1.0 / this.m_count);

  var k_inv3 = 1.0 / 3.0;

  for (var i = 0; i < this.m_count; ++i) {
    // Triangle vertices.
    var e1 = Vec2.sub(this.m_vertices[i], s);
    var e2 = i + 1 < this.m_count ? Vec2.sub(this.m_vertices[i + 1], s) : Vec2
        .sub(this.m_vertices[0], s);

    var D = Vec2.cross(e1, e2);

    var triangleArea = 0.5 * D;
    area += triangleArea;

    // Area weighted centroid
    center.addCombine(triangleArea * k_inv3, e1, triangleArea * k_inv3, e2);

    var ex1 = e1.x;
    var ey1 = e1.y;
    var ex2 = e2.x;
    var ey2 = e2.y;

    var intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
    var inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;

    I += (0.25 * k_inv3 * D) * (intx2 + inty2);
  }

  // Total mass
  massData.mass = density * area;

  // Center of mass
  _ASSERT && common.assert(area > Math.EPSILON);
  center.mul(1.0 / area);
  massData.center.setCombine(1, center, 1, s);

  // Inertia tensor relative to the local origin (point s).
  massData.I = density * I;

  // Shift to center of mass then to original body origin.
  massData.I += massData.mass
      * (Vec2.dot(massData.center, massData.center) - Vec2.dot(center, center));
}

// Validate convexity. This is a very time consuming operation.
// @returns true if valid
PolygonShape.prototype.validate = function() {
  for (var i = 0; i < this.m_count; ++i) {
    var i1 = i;
    var i2 = i < this.m_count - 1 ? i1 + 1 : 0;
    var p = this.m_vertices[i1];
    var e = Vec2.sub(this.m_vertices[i2], p);

    for (var j = 0; j < this.m_count; ++j) {
      if (j == i1 || j == i2) {
        continue;
      }

      var v = Vec2.sub(this.m_vertices[j], p);
      var c = Vec2.cross(e, v);
      if (c < 0.0) {
        return false;
      }
    }
  }

  return true;
}

PolygonShape.prototype.computeDistanceProxy = function(proxy) {
  proxy.m_vertices = this.m_vertices;
  proxy.m_count = this.m_count;
  proxy.m_radius = this.m_radius;
};


/***/ }),

/***/ "../../node_modules/planck-js/lib/util/Pool.js":
/*!*****************************************************!*\
  !*** ../../node_modules/planck-js/lib/util/Pool.js ***!
  \*****************************************************/
/***/ ((module) => {

/*
 * Copyright (c) 2016-2018 Ali Shakiba http://shakiba.me/planck.js
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 1. The origin of this software must not be misrepresented; you must not
 * claim that you wrote the original software. If you use this software
 * in a product, an acknowledgment in the product documentation would be
 * appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 * misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports = Pool;

function Pool(opts) {
  var _list = [];
  var _max = opts.max || Infinity;

  var _createFn = opts.create;
  var _outFn = opts.allocate;
  var _inFn = opts.release;
  var _discardFn = opts.discard;

  var _createCount = 0;
  var _outCount = 0;
  var _inCount = 0;
  var _discardCount = 0;

  this.max = function(n) {
    if (typeof n === 'number') {
      _max = n;
      return this;
    }
    return _max;
  };

  this.size = function() {
    return _list.length;
  };

  this.allocate = function() {
    var item;
    if (_list.length > 0) {
      item = _list.shift();
    } else {
      _createCount++;
      if (typeof _createFn === 'function') {
        item = _createFn();
      } else {
        item = {};
      }
    }
    _outCount++;
    if (typeof _outFn === 'function') {
      _outFn(item);
    }
    return item;
  };

  this.release = function(item) {
    if (_list.length < _max) {
      _inCount++;
      if (typeof _inFn === 'function') {
        _inFn(item);
      }
      _list.push(item);
    } else {
      _discardCount++;
      if (typeof _discardFn === 'function') {
        item = _discardFn(item);
      }
    }
  };

  this.toString = function() {
    return " +" + _createCount + " >" + _outCount + " <" + _inCount + " -"
        + _discardCount + " =" + _list.length + "/" + _max;
  };
}

/***/ }),

/***/ "../../node_modules/planck-js/lib/util/Timer.js":
/*!******************************************************!*\
  !*** ../../node_modules/planck-js/lib/util/Timer.js ***!
  \******************************************************/
/***/ ((module) => {

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

module.exports.now = function() {
  return Date.now();
}

module.exports.diff = function(time) {
  return Date.now() - time;
}


/***/ }),

/***/ "../../node_modules/planck-js/lib/util/common.js":
/*!*******************************************************!*\
  !*** ../../node_modules/planck-js/lib/util/common.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

exports.debug = function() {
  if (!_DEBUG) return;
  console.log.apply(console, arguments);
};

exports.assert = function(statement, err, log) {
  if (!_ASSERT) return;
  if (statement) return;
  log && console.log(log);
  throw new Error(err);
};

/***/ }),

/***/ "../../node_modules/planck-js/lib/util/options.js":
/*!********************************************************!*\
  !*** ../../node_modules/planck-js/lib/util/options.js ***!
  \********************************************************/
/***/ ((module) => {

var _DEBUG = typeof DEBUG === 'undefined' ? false : DEBUG;
var _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;

var propIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function(input, defaults) {
  if (input === null || typeof input === 'undefined') {
    input = {};
  }

  var output = Object.assign({}, input);

  for ( var key in defaults) {
    if (defaults.hasOwnProperty(key) && typeof input[key] === 'undefined') {
      output[key] = defaults[key];
    }
  }

  if (typeof Object.getOwnPropertySymbols === 'function') {
    var symbols = Object.getOwnPropertySymbols(defaults);
    for (var i = 0; i < symbols.length; i++) {
      var symbol = symbols[i];
      if (defaults.propertyIsEnumerable(symbol) && typeof input[key] === 'undefined') {
        output[symbol] = defaults[symbol];
      }
    }
  }

  return output;
};


/***/ }),

/***/ "../../node_modules/stats.js/build/stats.min.js":
/*!******************************************************!*\
  !*** ../../node_modules/stats.js/build/stats.min.js ***!
  \******************************************************/
/***/ (function(module) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():0})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),

/***/ "./src/assets/cat.ts":
/*!***************************!*\
  !*** ./src/assets/cat.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var cat = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAACACAYAAABqZmsaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACANJREFUeNq8W11oHUUUnl32QZSCIqgJBclDH6RGUyJUFCT4Q2M1xfZJCtIXbbSYvvqDmFSl5llFjBWJCEFfqkTUiq2UQMUK1WgsUnwoQok/IBWKPnrdM3fP3jNnz8zO2bv3DlzuZefM+b45c35mD0nS6XQMHaOjo4aPzc1NeN4xupHUCYDeZGRkBH532ERCiGiBQ0QqOJm0osFuQyOoK8UfC0vvm2ENilUSODhz31BIAAZgVQggCXCMQRABnaCbglsHoU4IAr5IqFO+MPuYifF6qh+c0BJoGGY8TLVrksoRNAWn39qRckbaM+VktP6TtuVMTR05oam4zg+amPntT04FHTSN2W0Q+OVl48mmcRYBC+SR0MHP0urJzjAG4ABeSQAfxBChcyArPY8BB2zrA3j2mjMmycT5rVybWAvQYxiW6RE3k9jF7gQ8nIZfbEQ4mZdaYJAOyHVXnHCYUUAdvnRC6kwYszFm1SYlq79ITLYaUgLUD2ji6JcI9RWaFbEcd0JOp3W0EDDHgY1aAvyapFXOi5GmRmRNzdqWf6R1OxrEoFipb4IT0hAMreVzZRT4yiU1NS72mV+a9xEvnLL3ZnTb7RPmxx/WK0LG9BwUQ2hhtvoiQ8Pr4Mym42hcFrCcIwAm++4ctxN0Eq/bZQIpFEnW4nMSOOoHLLyDZuyF1BaI499s2GfUIv34AG4KgPkFOOGv5wN4OTWhm7evHCe8PPfTH+Bpnj7Pigeu8qVdzju9JTE/rkIfPbLRvWXNjye5PucZJem+GxYguWCPpQD83y1b5az28yWJSEUXPivfDYHAs/v3m8WVldqd+sBDJDihEovmgcPbclb5xOiRFfXOuUzIEgAOWIuSE8LE4Rz4tV/GLRHtuYcGAJcblYoRMgRwnwX6GXZz+ae7uQ2XQM4u4cJNzjdWhmKm/Jx84DEAMeBcf0YZ5Z4ZlWxidzmQ/kCTyAgSaNpaoeBNSIC1Ib2nitQqHkX64VW1GbC2Q0ILTdvh5xsQjpANU5ooYsExV/Cd0ucx4PllRS5GmiOBNfS3Zi0QcBJR7Lkh2KUPHrQOCL+11gNMuGtWokBD4o3V6+xHa3ogi1GQ8YJRlwljUrYPHIsdYgGZShRoSND412RHtITbqi2YwQQIxJpVG3oU3EZB2R+YH6/cWpqYui5sEdztDwQ8mC7WEuHAHAc2aglonS+UdGL14FE07g88vedyK2U61aZRH5g2CsT7AJ3ghCSCthoWn5BsSG8ZBdTrfWeKi33nLM37LIvFKKNnCmmVCxnioBhCi+Sa7YZXVw6zHToalwWsxSIaU3jvg8Kw9dHP7QR1LkyXpIA439K9H78lcNQPWHkhS5wuGTzIJzrF77LYNHFSLoubAmDEKn2guA8YCoxE2h4UGMkk0t8PIBEU7Lc/wPXV9gdmlm+o9Ad2TB9QoX9/4j2rM1+XzCy7z7z9AQTJBUsJCfjGm68RQf/49R+JSEUXPnP6A3dP3GPOrK/V7tQHHiLBCSGW0x/496axfMKYMwU7zc65TMgSAA5YxqxV+wMwsWN6zFz9+0VLRHvuoQHAiOE4AfcBAJcEYy1Qdwx2c+trpQ+k6KncEk3ON1aGYqb8nHzgMQAx4Fx/RhkJcdrXLofSH4j1i4H0BxC8CQmwtqo/8OnO78SjePfP38QjkeSj+gNtxn5oYDimNFHEgmOu4LmePo8Bt1cybJ9368BYlAIIJQR+4f595pVA+pYGJqIyCjAp0N1EJBKz+dTRbkbLv7XWA0yxP6AhAePQtjvU5w5kxSjQ+AGMhy5ecL7rwLvF7oBTnCpR0CuXg48AJxMiM5gAgRiPRjmN91Nwpz9ATY+3lrrqqNmxFAFlfyB07nSxlggH5jiw0Yw6SEz5rEs6VJ7+5jkG1zfuD2zZeWsrZTrVplEfmAacYqW+CU5IIgig+AnJhvSWUUC93nemoQurb95n2bIY0TO9cvanihC8K6DCXgitGU6Yhhc6HMY8l7X+g4kIqmEukJxYetNOUOfCNxjcBSqSrMXnJHDUD1jTs4fc/gA8yCc6xW/7jFpE46RcFjcFwIgl9gcQGIm0PSgwkhH7A0gEBfvtD3B9tD8g/n/Bl5OflYsfOLe7UzxToefrvLp4LSgJIAgu9gF/tet6EfTeL/7yEpH0OwT2TD1hVk8fq92pDzxEghNCLKc/8NK1TxozlQuc3q3eOZcJWQLAAWvVHKumYphYf+ScFaKma2OATgQXi9HEx5P2+8W/3zJNnK5uzF3Zaz+gH7FKAtRTUbjJ+cbKUEznCICZDzwGIAac688oIx6n/e5yKP2BmMgYWH8AwZuQAGur+gPbH35GPIq5y6fEI5Hko/oDbYefb7y+5SObDVOaKGLBYbGU6+nzGPDK3w9odo/Atj9w8rjKeri2/PsBTAqa9AtgtD+gtR5giv0BbQ3Q9AfQ9EBWjAKNH8A4/+2E810HDlkQ9QOWGAUwUZeO24oAnoqt+e3EVLgoSV4fQxrlEdzpD1DT461FozyWKII7/YHQuWt3GQLmOLBRS6DJufuSTqwe9IPG/YHtdz3eSplOtWnUB6YBp1ipb4ITkggCKH5CsiG9ZRRQr/edKS72nbM077MsFqOMnun5r9+pCEFOQIUYQnCn54RpeM1N7nUcjcsCFsrb/gAUhleP7rQT1LnwDQZ3gYoka/E5CRz1A9Zzz5/t9QdAGB7kEzYl57+7OZ5YROOkXBY3BcCFfrk/gMBIpO1BgZHM/wIMACVz7F4IHFslAAAAAElFTkSuQmCC';
exports["default"] = cat;


/***/ }),

/***/ "./src/examples/scene.ts":
/*!*******************************!*\
  !*** ./src/examples/scene.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var game_1 = __webpack_require__(/*! @mythor/game */ "../game/lib/game.js");
var createMainScene_1 = __importDefault(__webpack_require__(/*! ./scene/createMainScene */ "./src/examples/scene/createMainScene.ts"));
var game = new game_1.Game((0, game_1.createLoadingScene)(), (0, createMainScene_1.default)());
game.start();


/***/ }),

/***/ "./src/examples/scene/createMainScene.ts":
/*!***********************************************!*\
  !*** ./src/examples/scene/createMainScene.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var createSecondScene_1 = __importDefault(__webpack_require__(/*! ./createSecondScene */ "./src/examples/scene/createSecondScene.ts"));
var SceneManager_1 = __importDefault(__webpack_require__(/*! @mythor/game/lib/managers/SceneManager */ "../game/lib/managers/SceneManager.js"));
var now_1 = __importDefault(__webpack_require__(/*! @mythor/core/lib/util/now */ "../core/lib/util/now.js"));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var game_1 = __webpack_require__(/*! @mythor/game */ "../game/lib/game.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var cat_1 = __importDefault(__webpack_require__(/*! ../../assets/cat */ "./src/assets/cat.ts"));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Click = (function (_super) {
    __extends(Click, _super);
    function Click() {
        return _super.call(this, 'Test') || this;
    }
    Click.prototype.update = function () {
        if (!this.ecs.managers.has(events_1.EventsManager)) {
            return;
        }
        var events = this.ecs.manager(events_1.EventsManager);
        if (events.mousePressed(events_1.MouseButton.Right)) {
            SceneManager_1.default.getInstance().pushOne((0, createSecondScene_1.default)()).swap();
        }
    };
    return Click;
}(core_1.Manager));
var Rotate = (function (_super) {
    __extends(Rotate, _super);
    function Rotate() {
        return _super.call(this, 'Rotate', [core_1.Transform]) || this;
    }
    Rotate.prototype.onEntityUpdate = function (entity, elapsedTimeInSeconds) {
        var transform = entity.get(core_1.Transform);
        transform.rotation += elapsedTimeInSeconds;
    };
    return Rotate;
}(core_1.System));
var FakeLoadingManager = (function (_super) {
    __extends(FakeLoadingManager, _super);
    function FakeLoadingManager() {
        var _this = _super.call(this, 'FakeLoadingManager') || this;
        _this.timeToWait = 1;
        return _this;
    }
    FakeLoadingManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startedTime, state;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startedTime = (0, now_1.default)();
                        state = this.ecs.manager(core_1.LoadingStateManager).createState({
                            detail: 'fakeLoadingManager',
                            name: 'FakeLoadingManager',
                            total: this.timeToWait,
                        });
                        return [4, new Promise(function (resolve) {
                                var timerId = setInterval(function () {
                                    var time = ((0, now_1.default)() - startedTime) * 0.001;
                                    state.current = Math.min(time, _this.timeToWait);
                                    state.detail = "FakeLoadingManager ".concat(((100 * state.current) /
                                        state.total).toFixed(0), "%");
                                    if (time >= _this.timeToWait) {
                                        clearInterval(timerId);
                                        resolve();
                                    }
                                }, 0);
                            })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return FakeLoadingManager;
}(core_1.Manager));
function createMainScene() {
    var _this = this;
    return new game_1.Scene('Mainscene', {
        managers: [
            new events_1.EventsManager(),
            new Click(),
            new core_1.LoadingStateManager(),
            new FakeLoadingManager(),
            new renderer_1.TextureManager([['f', cat_1.default]]),
        ],
        onInit: function (ecs) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ecs.create().add(new renderer_1.Renderable(), new renderer_1.Sprite(ecs.manager(renderer_1.TextureManager).get('f')), new core_1.Transform({
                    position: new math_1.Vec2(300, 0),
                }));
                return [2];
            });
        }); },
        systems: [new Rotate(), new renderer_1.Renderer()],
    });
}
exports["default"] = createMainScene;


/***/ }),

/***/ "./src/examples/scene/createSecondScene.ts":
/*!*************************************************!*\
  !*** ./src/examples/scene/createSecondScene.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var SceneManager_1 = __importDefault(__webpack_require__(/*! @mythor/game/lib/managers/SceneManager */ "../game/lib/managers/SceneManager.js"));
var game_1 = __webpack_require__(/*! @mythor/game */ "../game/lib/game.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var Click = (function (_super) {
    __extends(Click, _super);
    function Click() {
        return _super.call(this, 'Click') || this;
    }
    Click.prototype.update = function () {
        var events = this.ecs.manager(events_1.EventsManager);
        if (events.mousePressed(events_1.MouseButton.Right)) {
            SceneManager_1.default.getInstance().next();
        }
    };
    return Click;
}(core_1.Manager));
function createSecondScene() {
    var _this = this;
    return new game_1.Scene('SecondScene', {
        managers: [new events_1.EventsManager(), new Click()],
        onInit: function (ecs) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ecs.create().add(new renderer_1.Renderable(), new renderer_1.RenderedText('Second Scene', {
                    color: [0, 1, 0, 1],
                }), new core_1.Transform());
                return [2];
            });
        }); },
        systems: [new renderer_1.Renderer()],
    });
}
exports["default"] = createSecondScene;


/***/ }),

/***/ "../core/lib/collections/ConstructorMap.js":
/*!*************************************************!*\
  !*** ../core/lib/collections/ConstructorMap.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ./Signable */ "../core/lib/collections/Signable.js");
var ConstructorMap = (function () {
    function ConstructorMap() {
        this._map = new Map();
    }
    ConstructorMap.prototype.clear = function () {
        this._map.clear();
    };
    ConstructorMap.prototype.delete = function (key) {
        return this._map.delete(key);
    };
    ConstructorMap.prototype.map = function (callbackfn) {
        return Array.from(this._map).map(function (_a, index) {
            var value = _a[1];
            return callbackfn(value, index);
        });
    };
    ConstructorMap.prototype.forEach = function (callbackfn) {
        this._map.forEach(callbackfn);
    };
    ConstructorMap.prototype.forEachAsync = function (callbackfn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Promise.all(Array.from(this._map).map(function (_a) {
                            var key = _a[0], item = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4, callbackfn(item, key, this._map)];
                                    case 1: return [2, _b.sent()];
                                }
                            }); });
                        }))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ConstructorMap.prototype.get = function (constructor) {
        return this._map.get(constructor);
    };
    ConstructorMap.prototype.has = function (key) {
        return this._map.has(key);
    };
    ConstructorMap.prototype.set = function (value) {
        this._map.set((0, Signable_1.getConstructor)(value), value);
        return this;
    };
    Object.defineProperty(ConstructorMap.prototype, "size", {
        get: function () {
            return this._map.size;
        },
        enumerable: false,
        configurable: true
    });
    return ConstructorMap;
}());
exports["default"] = ConstructorMap;
//# sourceMappingURL=ConstructorMap.js.map

/***/ }),

/***/ "../core/lib/collections/EntityCollection.js":
/*!***************************************************!*\
  !*** ../core/lib/collections/EntityCollection.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var MapList_1 = __webpack_require__(/*! ../lists/MapList */ "../core/lib/lists/MapList.js");
var Signable_1 = __webpack_require__(/*! ./Signable */ "../core/lib/collections/Signable.js");
var ComponentRegistry_1 = __webpack_require__(/*! ../registries/ComponentRegistry */ "../core/lib/registries/ComponentRegistry.js");
var log_1 = __webpack_require__(/*! ../util/log */ "../core/lib/util/log.js");
var EntityCollection = (function () {
    function EntityCollection() {
        this._collectionLists = {};
        this.onNewList = function () {
        };
        this.componentRegistry = new ComponentRegistry_1.default();
    }
    Object.defineProperty(EntityCollection.prototype, "lists", {
        get: function () {
            return this._collectionLists;
        },
        enumerable: false,
        configurable: true
    });
    EntityCollection.prototype.select = function () {
        var constructors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            constructors[_i] = arguments[_i];
        }
        var signature = this.buildListSignature.apply(this, constructors);
        if (!(signature in this._collectionLists)) {
            this.createListFromSignature(signature, { constructors: constructors });
            (0, log_1.default)("Registering %clist%c \"".concat(constructors
                .map(function (constructor) { return constructor.name; })
                .join(), "\" as ").concat(signature), 'yellow');
        }
        return this._collectionLists[signature];
    };
    EntityCollection.prototype.createList = function (options, listConstructor) {
        var constructors = options.constructors;
        var signature = this.buildListSignature.apply(this, constructors);
        (0, log_1.default)("Registering %clist%c \"".concat(constructors
            .map(function (constructor) { return constructor.name; })
            .join(), "\" as ").concat(signature), 'yellow');
        return this.createListFromSignature(signature, options, listConstructor);
    };
    EntityCollection.prototype.getConstructorSignature = function (constructor) {
        if (!(0, Signable_1.isRegistered)(constructor)) {
            this.componentRegistry.registerConstructor(constructor);
        }
        return (0, Signable_1.getSignature)(constructor);
    };
    EntityCollection.prototype.createListFromSignature = function (signature, options, listConstructor) {
        var newList = new (listConstructor !== null && listConstructor !== void 0 ? listConstructor : MapList_1.default)(signature, options);
        this._collectionLists[signature] = newList;
        this.onNewList(newList);
        return newList;
    };
    EntityCollection.prototype.buildListSignature = function () {
        var _this = this;
        var constructors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            constructors[_i] = arguments[_i];
        }
        return constructors.reduce(function (accumulator, currentValue) {
            return accumulator | _this.getConstructorSignature(currentValue);
        }, 0);
    };
    EntityCollection.prototype.getEntitySignature = function (entity) {
        return this.buildListSignature.apply(this, entity.components.map(Signable_1.getConstructor));
    };
    EntityCollection.prototype.addEntity = function (entity) {
        var entitySignature = this.getEntitySignature(entity);
        for (var signature in this._collectionLists) {
            var collection = this._collectionLists[signature];
            if ((collection.signature & entitySignature) === collection.signature) {
                collection.add(entity);
            }
        }
    };
    EntityCollection.prototype.addEntityToCollection = function (entity, collection) {
        var entitySignature = this.getEntitySignature(entity);
        if ((collection.signature & entitySignature) === collection.signature) {
            collection.add(entity);
        }
    };
    EntityCollection.prototype.removeEntity = function (entity) {
        var entitySignature = this.getEntitySignature(entity);
        for (var signature in this._collectionLists) {
            var collection = this._collectionLists[signature];
            if ((collection.signature & entitySignature) === collection.signature) {
                collection.remove(entity);
            }
        }
    };
    return EntityCollection;
}());
exports["default"] = EntityCollection;
//# sourceMappingURL=EntityCollection.js.map

/***/ }),

/***/ "../core/lib/collections/Signable.js":
/*!*******************************************!*\
  !*** ../core/lib/collections/Signable.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRegistered = exports.getSignature = exports.getConstructor = void 0;
var Signable = (function () {
    function Signable() {
    }
    return Signable;
}());
function getConstructor(instance) {
    return instance.constructor;
}
exports.getConstructor = getConstructor;
function getSignature(constructor) {
    if (constructor.signature === undefined) {
        throw new Error('Cannot get signature of an unsigned Signable');
    }
    return constructor.signature;
}
exports.getSignature = getSignature;
function isRegistered(constructor) {
    return constructor.signature !== undefined;
}
exports.isRegistered = isRegistered;
exports["default"] = Signable;
//# sourceMappingURL=Signable.js.map

/***/ }),

/***/ "../core/lib/collections/SignableMap.js":
/*!**********************************************!*\
  !*** ../core/lib/collections/SignableMap.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ./Signable */ "../core/lib/collections/Signable.js");
var ConstructorRegistry_1 = __webpack_require__(/*! ../registries/ConstructorRegistry */ "../core/lib/registries/ConstructorRegistry.js");
var SignableMap = (function () {
    function SignableMap(name, color) {
        this.name = name;
        this._map = new Map();
        if (!SignableMap.constructorRegistries.has(name)) {
            SignableMap.constructorRegistries.set(name, new ConstructorRegistry_1.default(name, color));
        }
    }
    SignableMap.prototype.clear = function () {
        this._map.clear();
    };
    SignableMap.prototype.delete = function (key) {
        return this._map.delete((0, Signable_1.getSignature)(key));
    };
    SignableMap.prototype.map = function (callbackfn) {
        return Array.from(this._map).map(function (_a, index) {
            var value = _a[1];
            return callbackfn(value, index);
        });
    };
    SignableMap.prototype.forEach = function (callbackfn) {
        this._map.forEach(callbackfn);
    };
    SignableMap.prototype.forEachAsync = function (callbackfn) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Promise.all(Array.from(this._map).map(function (_a) {
                            var key = _a[0], item = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4, callbackfn(item, key, this._map)];
                                    case 1: return [2, _b.sent()];
                                }
                            }); });
                        }))];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SignableMap.prototype.get = function (constructor) {
        return this._map.get((0, Signable_1.getSignature)(constructor));
    };
    SignableMap.prototype.has = function (key) {
        if (!(0, Signable_1.isRegistered)(key)) {
            return false;
        }
        return this._map.has((0, Signable_1.getSignature)(key));
    };
    SignableMap.prototype.set = function (value) {
        var constructor = (0, Signable_1.getConstructor)(value);
        var signature = (0, Signable_1.isRegistered)(constructor)
            ? (0, Signable_1.getSignature)(constructor)
            : SignableMap.constructorRegistries
                .get(this.name)
                .registerConstructor(constructor);
        this._map.set(signature, value);
        return this;
    };
    Object.defineProperty(SignableMap.prototype, "size", {
        get: function () {
            return this._map.size;
        },
        enumerable: false,
        configurable: true
    });
    SignableMap.constructorRegistries = new Map();
    return SignableMap;
}());
exports["default"] = SignableMap;
//# sourceMappingURL=SignableMap.js.map

/***/ }),

/***/ "../core/lib/components/Owner.js":
/*!***************************************!*\
  !*** ../core/lib/components/Owner.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Owner = (function () {
    function Owner(entity) {
        this.id = entity._id;
    }
    Owner.prototype.is = function (entity) {
        return this.id === entity._id;
    };
    return Owner;
}());
exports["default"] = Owner;
//# sourceMappingURL=Owner.js.map

/***/ }),

/***/ "../core/lib/components/Transform.js":
/*!*******************************************!*\
  !*** ../core/lib/components/Transform.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Component_1 = __webpack_require__(/*! ../ecs/Component */ "../core/lib/ecs/Component.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Transform = (function (_super) {
    __extends(Transform, _super);
    function Transform(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.rotation, rotation = _c === void 0 ? 0 : _c, _d = _b.position, position = _d === void 0 ? math_1.Vec2.zero() : _d, _e = _b.size, size = _e === void 0 ? new math_1.Vec2(100, 100) : _e;
        var _this = _super.call(this) || this;
        _this._rotation = rotation;
        _this._position = position;
        _this._size = size;
        return _this;
    }
    Object.defineProperty(Transform.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "position", {
        get: function () {
            var _a;
            if (!((_a = this._entity) === null || _a === void 0 ? void 0 : _a.parent)) {
                return this._position;
            }
            if (!this._entity.parent.has(Transform)) {
                return this._position;
            }
            var parentTransform = this._entity.parent.get(Transform);
            return parentTransform.position.add(this._position.rotate(parentTransform.rotation));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transform.prototype, "rotation", {
        get: function () {
            var _a;
            if (!((_a = this._entity) === null || _a === void 0 ? void 0 : _a.parent)) {
                return this._rotation;
            }
            if (!this._entity.parent.has(Transform)) {
                return this._rotation;
            }
            return this._entity.parent.get(Transform).rotation + this._rotation;
        },
        set: function (value) {
            this._rotation = value;
        },
        enumerable: false,
        configurable: true
    });
    return Transform;
}(Component_1.default));
exports["default"] = Transform;
//# sourceMappingURL=Transform.js.map

/***/ }),

/***/ "../core/lib/core.js":
/*!***************************!*\
  !*** ../core/lib/core.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSignature = exports.getConstructor = exports.isRegistered = exports.Signable = exports.List = exports.LoadingStateManager = exports.Transform = exports.Owner = exports.Manager = exports.Ecs = exports.System = exports.SignableMap = exports.ConstructorMap = exports.Component = exports.Entity = exports.throwError = exports.log = void 0;
var log_1 = __webpack_require__(/*! ./util/log */ "../core/lib/util/log.js");
Object.defineProperty(exports, "log", ({ enumerable: true, get: function () { return log_1.default; } }));
var throwError_1 = __webpack_require__(/*! ./util/throwError */ "../core/lib/util/throwError.js");
Object.defineProperty(exports, "throwError", ({ enumerable: true, get: function () { return throwError_1.default; } }));
var Entity_1 = __webpack_require__(/*! ./ecs/Entity */ "../core/lib/ecs/Entity.js");
Object.defineProperty(exports, "Entity", ({ enumerable: true, get: function () { return Entity_1.default; } }));
var Component_1 = __webpack_require__(/*! ./ecs/Component */ "../core/lib/ecs/Component.js");
Object.defineProperty(exports, "Component", ({ enumerable: true, get: function () { return Component_1.default; } }));
var ConstructorMap_1 = __webpack_require__(/*! ./collections/ConstructorMap */ "../core/lib/collections/ConstructorMap.js");
Object.defineProperty(exports, "ConstructorMap", ({ enumerable: true, get: function () { return ConstructorMap_1.default; } }));
var SignableMap_1 = __webpack_require__(/*! ./collections/SignableMap */ "../core/lib/collections/SignableMap.js");
Object.defineProperty(exports, "SignableMap", ({ enumerable: true, get: function () { return SignableMap_1.default; } }));
var System_1 = __webpack_require__(/*! ./ecs/System */ "../core/lib/ecs/System.js");
Object.defineProperty(exports, "System", ({ enumerable: true, get: function () { return System_1.default; } }));
var Ecs_1 = __webpack_require__(/*! ./ecs/Ecs */ "../core/lib/ecs/Ecs.js");
Object.defineProperty(exports, "Ecs", ({ enumerable: true, get: function () { return Ecs_1.default; } }));
var Manager_1 = __webpack_require__(/*! ./ecs/Manager */ "../core/lib/ecs/Manager.js");
Object.defineProperty(exports, "Manager", ({ enumerable: true, get: function () { return Manager_1.default; } }));
var Owner_1 = __webpack_require__(/*! ./components/Owner */ "../core/lib/components/Owner.js");
Object.defineProperty(exports, "Owner", ({ enumerable: true, get: function () { return Owner_1.default; } }));
var Transform_1 = __webpack_require__(/*! ./components/Transform */ "../core/lib/components/Transform.js");
Object.defineProperty(exports, "Transform", ({ enumerable: true, get: function () { return Transform_1.default; } }));
var LoadingStateManager_1 = __webpack_require__(/*! ./managers/LoadingStateManager */ "../core/lib/managers/LoadingStateManager.js");
Object.defineProperty(exports, "LoadingStateManager", ({ enumerable: true, get: function () { return LoadingStateManager_1.default; } }));
var List_1 = __webpack_require__(/*! ./lists/List */ "../core/lib/lists/List.js");
Object.defineProperty(exports, "List", ({ enumerable: true, get: function () { return List_1.default; } }));
var Signable_1 = __webpack_require__(/*! ./collections/Signable */ "../core/lib/collections/Signable.js");
Object.defineProperty(exports, "Signable", ({ enumerable: true, get: function () { return Signable_1.default; } }));
Object.defineProperty(exports, "isRegistered", ({ enumerable: true, get: function () { return Signable_1.isRegistered; } }));
Object.defineProperty(exports, "getConstructor", ({ enumerable: true, get: function () { return Signable_1.getConstructor; } }));
Object.defineProperty(exports, "getSignature", ({ enumerable: true, get: function () { return Signable_1.getSignature; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ "../core/lib/ecs/Component.js":
/*!************************************!*\
  !*** ../core/lib/ecs/Component.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(Signable_1.default));
exports["default"] = Component;
//# sourceMappingURL=Component.js.map

/***/ }),

/***/ "../core/lib/ecs/Ecs.js":
/*!******************************!*\
  !*** ../core/lib/ecs/Ecs.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Entity_1 = __webpack_require__(/*! ./Entity */ "../core/lib/ecs/Entity.js");
var EntityCollection_1 = __webpack_require__(/*! ../collections/EntityCollection */ "../core/lib/collections/EntityCollection.js");
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var now_1 = __webpack_require__(/*! ../util/now */ "../core/lib/util/now.js");
var SignableMap_1 = __webpack_require__(/*! ../collections/SignableMap */ "../core/lib/collections/SignableMap.js");
var Ecs = (function () {
    function Ecs(options) {
        var _this = this;
        var _a;
        this._entitiesToCreate = [];
        this._entitiesToDestroy = [];
        this._queueEntities = (_a = options === null || options === void 0 ? void 0 : options.queueEntities) !== null && _a !== void 0 ? _a : false;
        this._entities = new Map();
        this._duration = 0;
        this._systems = new SignableMap_1.default('system', 'lightblue');
        this._managers = new SignableMap_1.default('manager', 'red');
        this._entityCollections = new EntityCollection_1.default();
        this._entityCollections.onNewList = function (list) {
            _this._entities.forEach(function (entity) {
                return _this._entityCollections.addEntityToCollection(entity, list);
            });
        };
    }
    Object.defineProperty(Ecs.prototype, "entities", {
        get: function () {
            return this._entities;
        },
        enumerable: false,
        configurable: true
    });
    Ecs.prototype.getEntityNumber = function () {
        return this._entities.size;
    };
    Object.defineProperty(Ecs.prototype, "systems", {
        get: function () {
            return this._systems;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ecs.prototype, "managers", {
        get: function () {
            return this._managers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ecs.prototype, "entityCollections", {
        get: function () {
            return this._entityCollections;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ecs.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: false,
        configurable: true
    });
    Ecs.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.systems.forEachAsync(function (system) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, system.init(this)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [4, this.managers.forEachAsync(function (manager) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, manager.init(this)];
                                    case 1: return [2, _a.sent()];
                                }
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Ecs.prototype.stop = function () {
        this._systems.clear();
        this._managers.clear();
        this._entities.clear();
        this._entitiesToDestroy.length = 0;
        this._entitiesToCreate.length = 0;
        this._duration = 0;
    };
    Ecs.prototype.update = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        var _this = this;
        var beginTotal = (0, now_1.default)();
        this.managers.forEach(function (manager) {
            manager.update(_this, elapsedTimeInSeconds, totalTimeInSeconds);
        });
        this.systems.forEach(function (system) {
            var begin = (0, now_1.default)();
            if (!system.disabled()) {
                system.update(elapsedTimeInSeconds, totalTimeInSeconds);
                system.setDuration((0, now_1.default)() - begin);
            }
            else {
                system.setDuration(0);
            }
        });
        this.managers.forEach(function (manager) {
            manager.postUpdate(_this);
        });
        this._duration = (0, now_1.default)() - beginTotal;
        this.destroyEntities();
    };
    Ecs.prototype.destroyEntities = function () {
        while (this._entitiesToDestroy.length > 0) {
            var entityToDestroy = this._entitiesToDestroy.shift();
            if (!entityToDestroy) {
                return;
            }
            this.__destroyEntity(entityToDestroy);
        }
    };
    Ecs.prototype.registerSystems = function () {
        var _this = this;
        var systemInstances = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            systemInstances[_i] = arguments[_i];
        }
        systemInstances.forEach(function (systemInstance) {
            var constructor = (0, Signable_1.getConstructor)(systemInstance);
            if (!(0, Signable_1.isRegistered)(constructor) || !_this.systems.has(constructor)) {
                _this.systems.set(systemInstance);
            }
        });
    };
    Ecs.prototype.registerManagers = function () {
        var _this = this;
        var managerInstances = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            managerInstances[_i] = arguments[_i];
        }
        managerInstances.forEach(function (managerInstance) {
            var constructor = (0, Signable_1.getConstructor)(managerInstance);
            if (!_this.managers.has(constructor)) {
                _this.managers.set(managerInstance);
                managerInstance.ecs = _this;
            }
        });
    };
    Ecs.prototype.system = function (constructor) {
        return this._systems.get(constructor);
    };
    Ecs.prototype.manager = function (constructor) {
        return this.managers.get(constructor);
    };
    Ecs.prototype.entity = function (entityId) {
        return this._entities.get(entityId);
    };
    Ecs.prototype.create = function (id) {
        if (id === void 0) { id = undefined; }
        var entity = new Entity_1.default(id);
        entity.setEcs(this);
        if (this._queueEntities) {
            this._entitiesToCreate.push(entity);
        }
        else {
            this._entities.set(entity._id, entity);
        }
        return entity;
    };
    Ecs.prototype.createList = function (options, listConstructor) {
        return this._entityCollections.createList(options, listConstructor);
    };
    Ecs.prototype.addEntityToCollections = function (entity) {
        if (this._queueEntities) {
            return;
        }
        this._entityCollections.addEntity(entity);
    };
    Ecs.prototype.destroyEntity = function (entity) {
        this._entitiesToDestroy.push(entity);
    };
    Ecs.prototype.flush = function (reset) {
        if (reset === void 0) { reset = false; }
        while (this._entitiesToCreate.length > 0) {
            var entity = this._entitiesToCreate.shift();
            if (entity == null) {
                return;
            }
            this._entityCollections.addEntity(entity);
            this._entities.set(entity._id, entity);
        }
        if (reset) {
            this._queueEntities = false;
        }
    };
    Ecs.prototype.__destroyEntity = function (entity) {
        this._entityCollections.removeEntity(entity);
        this._entities.delete(entity._id);
    };
    return Ecs;
}());
exports["default"] = Ecs;
//# sourceMappingURL=Ecs.js.map

/***/ }),

/***/ "../core/lib/ecs/Entity.js":
/*!*********************************!*\
  !*** ../core/lib/ecs/Entity.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var ComponentRegistry_1 = __webpack_require__(/*! ../registries/ComponentRegistry */ "../core/lib/registries/ComponentRegistry.js");
var uuidv4_1 = __webpack_require__(/*! ../util/uuidv4 */ "../core/lib/util/uuidv4.js");
var Entity = (function () {
    function Entity(id) {
        this._children = [];
        this._tags = [];
        this._id = id !== null && id !== void 0 ? id : (0, uuidv4_1.default)();
        this._components = new Map();
    }
    Object.defineProperty(Entity.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "components", {
        get: function () {
            return Array.from(this._components.values());
        },
        enumerable: false,
        configurable: true
    });
    Entity.prototype.setEcs = function (ecs) {
        this._ecs = ecs;
    };
    Entity.prototype.addChild = function (otherEntity) {
        otherEntity._parent = this;
        this._children.push(otherEntity);
        return this;
    };
    Entity.prototype.addComponent = function (componentInstance) {
        var constructor = (0, Signable_1.getConstructor)(componentInstance);
        if (!(0, Signable_1.isRegistered)(constructor)) {
            var cr = new ComponentRegistry_1.default();
            cr.registerConstructor(constructor);
        }
        this._components.set((0, Signable_1.getSignature)(constructor), componentInstance);
        return this;
    };
    Entity.prototype.add = function () {
        var _this = this;
        var _a;
        var components = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            components[_i] = arguments[_i];
        }
        components.forEach(function (component) {
            component._entity = _this;
            _this.addComponent(component);
        });
        (_a = this._ecs) === null || _a === void 0 ? void 0 : _a.addEntityToCollections(this);
        return this;
    };
    Entity.prototype.get = function (constructor) {
        return this._components.get((0, Signable_1.getSignature)(constructor));
    };
    Entity.prototype.getRecursive = function (constructor) {
        if (this.has(constructor)) {
            return this.get(constructor);
        }
        if (this.parent != null) {
            return this.parent.getRecursive(constructor);
        }
        return undefined;
    };
    Entity.prototype.forEachChild = function (cb, recursive) {
        if (recursive === void 0) { recursive = false; }
        this._children.forEach(function (entity) {
            if (recursive) {
                entity.forEachChild(cb, recursive);
            }
            cb(entity);
        });
    };
    Entity.prototype.has = function (componentConstructor) {
        if (componentConstructor.signature === undefined) {
            return false;
        }
        return this._components.has((0, Signable_1.getSignature)(componentConstructor));
    };
    Entity.prototype.tag = function (tagName) {
        this._tags.push(tagName);
        return this;
    };
    Entity.prototype.hasTag = function (tagName) {
        return this._tags.includes(tagName);
    };
    Entity.prototype.remove = function (componentConstructor) {
        if (componentConstructor.signature === undefined) {
            throw new Error('Cannot remove an unsigned Component');
        }
        if (this.has(componentConstructor)) {
            this._components.delete(componentConstructor.signature);
        }
        return this;
    };
    Entity.prototype.destroy = function (cascade) {
        var _a;
        if (cascade === void 0) { cascade = true; }
        if (cascade) {
            this._children.forEach(function (child) { return child.destroy(true); });
        }
        (_a = this._ecs) === null || _a === void 0 ? void 0 : _a.destroyEntity(this);
    };
    return Entity;
}());
exports["default"] = Entity;
//# sourceMappingURL=Entity.js.map

/***/ }),

/***/ "../core/lib/ecs/Manager.js":
/*!**********************************!*\
  !*** ../core/lib/ecs/Manager.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager(name) {
        var _this = _super.call(this) || this;
        _this._name = name;
        return _this;
    }
    Object.defineProperty(Manager.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Manager.prototype.init = function (ecs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    Manager.prototype.postUpdate = function (ecs) {
    };
    Manager.prototype.update = function (ecs, elapsedTimeInSeconds, totalTimeInSeconds) {
    };
    Manager.prototype.clear = function () {
    };
    return Manager;
}(Signable_1.default));
exports["default"] = Manager;
//# sourceMappingURL=Manager.js.map

/***/ }),

/***/ "../core/lib/ecs/System.js":
/*!*********************************!*\
  !*** ../core/lib/ecs/System.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var System = (function (_super) {
    __extends(System, _super);
    function System(name, components, dependencies) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this) || this;
        _this._disabled = false;
        _this._duration = 0;
        _this._name = name;
        _this.components = components;
        _this.dependencies = {
            list: dependencies === null || dependencies === void 0 ? void 0 : dependencies.list,
            managers: (_a = dependencies === null || dependencies === void 0 ? void 0 : dependencies.managers) !== null && _a !== void 0 ? _a : [],
            systems: (_b = dependencies === null || dependencies === void 0 ? void 0 : dependencies.systems) !== null && _b !== void 0 ? _b : [],
        };
        return _this;
    }
    System.prototype.disabled = function (value) {
        if (value !== undefined) {
            this._disabled = value;
        }
        return this._disabled;
    };
    Object.defineProperty(System.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    System.prototype.setDuration = function (n) {
        this._duration = n;
    };
    Object.defineProperty(System.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: false,
        configurable: true
    });
    System.prototype.init = function (ecs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ecs = ecs;
                        this.checkDependencies();
                        if (this.components.length === 0) {
                            throw new Error("System \"".concat(this.name, "\" uses 0 component. It should be a manager"));
                        }
                        this.entities = this.ecs.createList({
                            constructors: this.components,
                            onCreate: this.onEntityCreation.bind(this),
                            onDelete: this.onEntityDestruction.bind(this),
                            shouldBeAdded: this.shouldBeAdded.bind(this),
                        }, this.dependencies.list);
                        return [4, this.onSystemInit(ecs)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    System.prototype.getEntities = function () {
        return this.entities;
    };
    System.prototype.update = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        var _this = this;
        this.entities.forEach(function (entity) {
            _this.onEntityUpdate(entity, elapsedTimeInSeconds, totalTimeInSeconds);
        });
    };
    System.prototype.clear = function () {
    };
    System.prototype.checkDependencies = function () {
        var _this = this;
        this.dependencies.systems.forEach(function (systemConstructor) {
            if (!_this.ecs.systems.has(systemConstructor)) {
                throw new Error("".concat(_this.name, " is missing system dependencies"));
            }
        });
        this.dependencies.managers.forEach(function (managerConstructor) {
            if (!_this.ecs.managers.has(managerConstructor)) {
                throw new Error("".concat(_this.name, " is missing manager dependencies"));
            }
        });
    };
    System.prototype.onEntityUpdate = function (entity, elapsedTimeInSeconds, totalTimeInSeconds) {
    };
    System.prototype.onSystemInit = function (ecs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    System.prototype.onEntityDestruction = function (entity) {
    };
    System.prototype.onEntityCreation = function (entity) {
    };
    System.prototype.shouldBeAdded = function (entity) {
        return true;
    };
    return System;
}(Signable_1.default));
exports["default"] = System;
//# sourceMappingURL=System.js.map

/***/ }),

/***/ "../core/lib/lists/List.js":
/*!*********************************!*\
  !*** ../core/lib/lists/List.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var List = (function () {
    function List(signature, options) {
        var _a;
        this._contructors = [];
        this._signature = signature;
        this._contructors = options.constructors;
        this.shouldBeAdded = (_a = options.shouldBeAdded) !== null && _a !== void 0 ? _a : (function () { return true; });
        this.onCreate = options.onCreate;
        this.onDelete = options.onDelete;
    }
    Object.defineProperty(List.prototype, "constructors", {
        get: function () {
            return this._contructors;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "signature", {
        get: function () {
            return this._signature;
        },
        enumerable: false,
        configurable: true
    });
    List.prototype.add = function (data) {
        var _a;
        if (!this.shouldBeAdded(data)) {
            return;
        }
        this.__add(data);
        (_a = this.onCreate) === null || _a === void 0 ? void 0 : _a.call(this, data);
    };
    List.prototype.remove = function (data) {
        var _a;
        (_a = this.onDelete) === null || _a === void 0 ? void 0 : _a.call(this, data);
        this.__remove(data);
    };
    List.prototype.__add = function (data) {
        throw new Error('should be implemented');
    };
    List.prototype.__remove = function (data) {
        throw new Error('should be implemented');
    };
    return List;
}());
exports["default"] = List;
//# sourceMappingURL=List.js.map

/***/ }),

/***/ "../core/lib/lists/MapList.js":
/*!************************************!*\
  !*** ../core/lib/lists/MapList.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var List_1 = __webpack_require__(/*! ./List */ "../core/lib/lists/List.js");
var MapList = (function (_super) {
    __extends(MapList, _super);
    function MapList(signature, options) {
        var _this = _super.call(this, signature, options) || this;
        _this._data = new Map();
        return _this;
    }
    MapList.prototype.__add = function (data) {
        this._data.set(data._id, data);
    };
    MapList.prototype.__remove = function (data) {
        this._data.delete(data._id);
    };
    MapList.prototype.clear = function () {
        this._data = new Map();
    };
    MapList.prototype.forEach = function (callback) {
        this._data.forEach(callback);
    };
    Object.defineProperty(MapList.prototype, "length", {
        get: function () {
            return this._data.size;
        },
        enumerable: false,
        configurable: true
    });
    return MapList;
}(List_1.default));
exports["default"] = MapList;
//# sourceMappingURL=MapList.js.map

/***/ }),

/***/ "../core/lib/managers/LoadingStateManager.js":
/*!***************************************************!*\
  !*** ../core/lib/managers/LoadingStateManager.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Manager_1 = __webpack_require__(/*! ../ecs/Manager */ "../core/lib/ecs/Manager.js");
var LoadingStateManager = (function (_super) {
    __extends(LoadingStateManager, _super);
    function LoadingStateManager() {
        var _this = _super.call(this, 'LoadingStateManager') || this;
        _this.loadingStates = new Map();
        return _this;
    }
    LoadingStateManager.prototype.createState = function (state) {
        var _a, _b, _c, _d;
        var newState = {
            current: (_a = state.current) !== null && _a !== void 0 ? _a : 0,
            detail: (_b = state.detail) !== null && _b !== void 0 ? _b : '',
            name: state.name,
            total: (_c = state.total) !== null && _c !== void 0 ? _c : 100,
            weight: (_d = state.weight) !== null && _d !== void 0 ? _d : 1,
        };
        this.loadingStates.set(state.name, newState);
        return newState;
    };
    LoadingStateManager.prototype.getState = function (stateName) {
        return this.loadingStates.get(stateName);
    };
    LoadingStateManager.prototype.getLoadingPercentage = function () {
        var values = Array.from(this.loadingStates.values());
        var _a = values.reduce(function (_a, state) {
            var accTotal = _a[0], accTotalWeight = _a[1];
            var percentage = state.current / state.total;
            return [
                accTotal + percentage * state.weight,
                accTotalWeight + state.weight,
            ];
        }, [0, 0]), total = _a[0], totalWeight = _a[1];
        return (total * 100) / (totalWeight || 1);
    };
    LoadingStateManager.prototype.getLoadingDetail = function () {
        var states = Array.from(this.loadingStates.values());
        for (var _i = 0, states_1 = states; _i < states_1.length; _i++) {
            var state = states_1[_i];
            if (state.current < state.total) {
                return state.detail;
            }
        }
        return '';
    };
    return LoadingStateManager;
}(Manager_1.default));
exports["default"] = LoadingStateManager;
//# sourceMappingURL=LoadingStateManager.js.map

/***/ }),

/***/ "../core/lib/registries/ComponentRegistry.js":
/*!***************************************************!*\
  !*** ../core/lib/registries/ComponentRegistry.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var log_1 = __webpack_require__(/*! ../util/log */ "../core/lib/util/log.js");
var ConstructorRegistry_1 = __webpack_require__(/*! ./ConstructorRegistry */ "../core/lib/registries/ConstructorRegistry.js");
var ComponentRegistry = (function (_super) {
    __extends(ComponentRegistry, _super);
    function ComponentRegistry(name) {
        if (name === void 0) { name = 'component'; }
        var _this = this;
        var color = 'SeaGreen';
        _this = _super.call(this, name, color) || this;
        if (ComponentRegistry.instance) {
            return ComponentRegistry.instance;
        }
        ComponentRegistry.instance = _this;
        (0, log_1.default)('Creating %cComponentRegistry%c', color);
        return _this;
    }
    return ComponentRegistry;
}(ConstructorRegistry_1.default));
exports["default"] = ComponentRegistry;
//# sourceMappingURL=ComponentRegistry.js.map

/***/ }),

/***/ "../core/lib/registries/ConstructorRegistry.js":
/*!*****************************************************!*\
  !*** ../core/lib/registries/ConstructorRegistry.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Signable_1 = __webpack_require__(/*! ../collections/Signable */ "../core/lib/collections/Signable.js");
var log_1 = __webpack_require__(/*! ../util/log */ "../core/lib/util/log.js");
var ConstructorRegistry = (function () {
    function ConstructorRegistry(name, color) {
        this.bits = 0;
        this.constructors = [];
        this.name = name;
        this.color = color;
    }
    ConstructorRegistry.prototype.registerConstructor = function (constructor) {
        if ((0, Signable_1.isRegistered)(constructor)) {
            return (0, Signable_1.getSignature)(constructor);
        }
        var newBit = 1 << this.bits;
        this.bits++;
        constructor.signature = newBit;
        (0, log_1.default)("Registering %c".concat(this.name, "%c \"").concat(constructor.name, "\" as ").concat(newBit), this.color);
        this.constructors.push(constructor);
        return newBit;
    };
    return ConstructorRegistry;
}());
exports["default"] = ConstructorRegistry;
//# sourceMappingURL=ConstructorRegistry.js.map

/***/ }),

/***/ "../core/lib/util/log.js":
/*!*******************************!*\
  !*** ../core/lib/util/log.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var log = function (text, color) {
    if (color === void 0) { color = 'none'; }
    if (typeof text === 'string' && text.includes('%c')) {
        console.log(text, "color: ".concat(color, ";"), 'color: none;');
    }
    else if (typeof text === 'string') {
        console.log("%c".concat(text, "%c"), "color: ".concat(color, ";"), 'color: none;');
    }
    else {
        console.log(text);
    }
};
exports["default"] = log;
//# sourceMappingURL=log.js.map

/***/ }),

/***/ "../core/lib/util/now.js":
/*!*******************************!*\
  !*** ../core/lib/util/now.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var perf = performance !== null && performance !== void 0 ? performance : Date;
var now = perf.now.bind(perf);
exports["default"] = now;
//# sourceMappingURL=now.js.map

/***/ }),

/***/ "../core/lib/util/throwError.js":
/*!**************************************!*\
  !*** ../core/lib/util/throwError.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var throwError = function (errorString) {
    if (false) {}
    else {
        console.error("".concat(errorString, ".\n\n\u26A0 This would throw an error on production"));
    }
};
exports["default"] = throwError;
//# sourceMappingURL=throwError.js.map

/***/ }),

/***/ "../core/lib/util/uuidv4.js":
/*!**********************************!*\
  !*** ../core/lib/util/uuidv4.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports["default"] = uuidv4;
//# sourceMappingURL=uuidv4.js.map

/***/ }),

/***/ "../events/lib/definitions/Key.js":
/*!****************************************!*\
  !*** ../events/lib/definitions/Key.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Key;
(function (Key) {
    Key["Backspace"] = "Backspace";
    Key["Tab"] = "Tab";
    Key["Enter"] = "Enter";
    Key["Shift"] = "Shift";
    Key["Control"] = "Control";
    Key["Alt"] = "Alt";
    Key["Pause"] = "Pause";
    Key["CapsLock"] = "CapsLock";
    Key["Escape"] = "Escape";
    Key["Space"] = " ";
    Key["PageUp"] = "PageUp";
    Key["PageDown"] = "PageDown";
    Key["End"] = "End";
    Key["Home"] = "Home";
    Key["ArrowLeft"] = "ArrowLeft";
    Key["ArrowUp"] = "ArrowUp";
    Key["ArrowRight"] = "ArrowRight";
    Key["ArrowDown"] = "ArrowDown";
    Key["PrintScreen"] = "PrintScreen";
    Key["Insert"] = "Insert";
    Key["Delete"] = "Delete";
    Key["Digit0"] = "0";
    Key["Digit1"] = "1";
    Key["Digit2"] = "2";
    Key["Digit3"] = "3";
    Key["Digit4"] = "4";
    Key["Digit5"] = "5";
    Key["Digit6"] = "6";
    Key["Digit7"] = "7";
    Key["Digit8"] = "8";
    Key["Digit9"] = "9";
    Key["A"] = "A";
    Key["B"] = "B";
    Key["C"] = "C";
    Key["D"] = "D";
    Key["E"] = "E";
    Key["F"] = "F";
    Key["G"] = "G";
    Key["H"] = "H";
    Key["I"] = "I";
    Key["J"] = "J";
    Key["K"] = "K";
    Key["L"] = "L";
    Key["M"] = "M";
    Key["N"] = "N";
    Key["O"] = "O";
    Key["P"] = "P";
    Key["Q"] = "Q";
    Key["R"] = "R";
    Key["S"] = "S";
    Key["T"] = "T";
    Key["U"] = "U";
    Key["V"] = "V";
    Key["W"] = "W";
    Key["X"] = "X";
    Key["Y"] = "Y";
    Key["Z"] = "Z";
    Key["a"] = "a";
    Key["b"] = "b";
    Key["c"] = "c";
    Key["d"] = "d";
    Key["e"] = "e";
    Key["f"] = "f";
    Key["g"] = "g";
    Key["h"] = "h";
    Key["i"] = "i";
    Key["j"] = "j";
    Key["k"] = "k";
    Key["l"] = "l";
    Key["m"] = "m";
    Key["n"] = "n";
    Key["o"] = "o";
    Key["p"] = "p";
    Key["q"] = "q";
    Key["r"] = "r";
    Key["s"] = "s";
    Key["t"] = "t";
    Key["u"] = "u";
    Key["v"] = "v";
    Key["w"] = "w";
    Key["x"] = "x";
    Key["y"] = "y";
    Key["z"] = "z";
    Key["Meta"] = "Meta";
    Key["ContextMenu"] = "ContextMenu";
    Key["AudioVolumeMute"] = "AudioVolumeMute";
    Key["AudioVolumeDown"] = "AudioVolumeDown";
    Key["AudioVolumeUp"] = "AudioVolumeUp";
    Key["F1"] = "F1";
    Key["F2"] = "F2";
    Key["F3"] = "F3";
    Key["F4"] = "F4";
    Key["F5"] = "F5";
    Key["F6"] = "F6";
    Key["F7"] = "F7";
    Key["F8"] = "F8";
    Key["F9"] = "F9";
    Key["F10"] = "F10";
    Key["F11"] = "F11";
    Key["F12"] = "F12";
    Key["NumLock"] = "NumLock";
    Key["ScrollLock"] = "ScrollLock";
    Key["Semicolon"] = ";";
    Key["Equal"] = "=";
    Key["Comma"] = ",";
    Key["Minus"] = "-";
    Key["Period"] = ".";
    Key["Slash"] = "/";
    Key["Backquote"] = "`";
    Key["BracketLeft"] = "[";
    Key["Backslash"] = "\\";
    Key["BracketRight"] = "]";
    Key["Quote"] = "'";
    Key["Tilde"] = "~";
    Key["Exclamation"] = "!";
    Key["At"] = "@";
    Key["Sharp"] = "#";
    Key["Dollar"] = "$";
    Key["Percent"] = "%";
    Key["Caret"] = "^";
    Key["Ampersand"] = "&";
    Key["Asterisk"] = "*";
    Key["ParenthesisLeft"] = "(";
    Key["ParenthesisRight"] = ")";
    Key["Underscore"] = "_";
    Key["Plus"] = "+";
    Key["OpenBrace"] = "{";
    Key["CloseBrace"] = "}";
    Key["Pipe"] = "|";
    Key["Colon"] = ":";
    Key["Quote2"] = "\"";
    Key["AngleBracketLeft"] = "<";
    Key["AngleBracketRight"] = ">";
    Key["QuestionMark"] = "?";
})(Key || (Key = {}));
exports["default"] = Key;
//# sourceMappingURL=Key.js.map

/***/ }),

/***/ "../events/lib/definitions/MouseButton.js":
/*!************************************************!*\
  !*** ../events/lib/definitions/MouseButton.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton || (MouseButton = {}));
exports["default"] = MouseButton;
//# sourceMappingURL=MouseButton.js.map

/***/ }),

/***/ "../events/lib/events.js":
/*!*******************************!*\
  !*** ../events/lib/events.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseButton = exports.Key = exports.EventsManager = void 0;
var EventsManager_1 = __webpack_require__(/*! ./managers/EventsManager */ "../events/lib/managers/EventsManager.js");
Object.defineProperty(exports, "EventsManager", ({ enumerable: true, get: function () { return EventsManager_1.default; } }));
var Key_1 = __webpack_require__(/*! ./definitions/Key */ "../events/lib/definitions/Key.js");
Object.defineProperty(exports, "Key", ({ enumerable: true, get: function () { return Key_1.default; } }));
var MouseButton_1 = __webpack_require__(/*! ./definitions/MouseButton */ "../events/lib/definitions/MouseButton.js");
Object.defineProperty(exports, "MouseButton", ({ enumerable: true, get: function () { return MouseButton_1.default; } }));
//# sourceMappingURL=events.js.map

/***/ }),

/***/ "../events/lib/managers/EventsManager.js":
/*!***********************************************!*\
  !*** ../events/lib/managers/EventsManager.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var getKey = function (event) { return event.key; };
var getMouse = function (event) { return event.button; };
var EventsManager = (function (_super) {
    __extends(EventsManager, _super);
    function EventsManager(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, 'EventsManager') || this;
        _this.initialized = false;
        _this.events = {
            contextmenu: function (event) { return event.preventDefault(); },
            keydown: function (event) { return _this.setKeyValue(event, true); },
            keyup: function (event) { return _this.setKeyValue(event, false); },
            mousedown: function (event) { return _this.setMouseValue(event, true); },
            mouseenter: function () { return _this.canvas.focus(); },
            mousemove: function (event) { return _this.setMousePosition(event); },
            mouseup: function (event) { return _this.setMouseValue(event, false); },
            wheel: function (event) { return _this.setWheel(event); },
        };
        if (EventsManager.instance) {
            return EventsManager.instance;
        }
        EventsManager.instance = _this;
        if (options === null || options === void 0 ? void 0 : options.canvas) {
            _this.canvas = options.canvas;
        }
        else {
            var canvas = document.getElementById((_a = options === null || options === void 0 ? void 0 : options.canvasId) !== null && _a !== void 0 ? _a : 'canvas');
            if (!canvas) {
                throw new Error('Could not find canvas');
            }
            _this.canvas = canvas;
        }
        _this.canvas.tabIndex = 1;
        _this.canvas.focus();
        _this.canvasRect = _this.canvas.getBoundingClientRect();
        _this._keysDown = new Map();
        _this._previousKeysDown = new Map();
        _this._mousesDown = new Map();
        _this._previousMousesDown = new Map();
        _this._mousePosition = math_1.Vec2.zero();
        _this._previousMousePosition = math_1.Vec2.zero();
        _this._wheelDelta = 0;
        _this._minDragDelta = (_b = options === null || options === void 0 ? void 0 : options.minDragDelta) !== null && _b !== void 0 ? _b : 1;
        return _this;
    }
    EventsManager.prototype.setMousePosition = function (event) {
        this.canvasRect = this.canvas.getBoundingClientRect();
        var x = ((event.clientX - this.canvasRect.left) /
            (this.canvasRect.right - this.canvasRect.left)) *
            this.canvas.width;
        var y = ((event.clientY - this.canvasRect.top) /
            (this.canvasRect.bottom - this.canvasRect.top)) *
            this.canvas.height;
        this._mousePosition.set(x, y);
    };
    EventsManager.prototype.setWheel = function (event) {
        event.preventDefault();
        this._wheelDelta += event.deltaY;
    };
    EventsManager.prototype.setKeyValue = function (event, value) {
        event.preventDefault();
        this._keysDown.set(getKey(event), value);
    };
    EventsManager.prototype.setMouseValue = function (event, value) {
        event.preventDefault();
        this._mousesDown.set(getMouse(event), value);
    };
    EventsManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.initialized) {
                    return [2];
                }
                this.initialized = true;
                Object.entries(this.events).forEach(function (_a) {
                    var eventName = _a[0], fn = _a[1];
                    _this.canvas.addEventListener(eventName, fn, false);
                });
                window.addEventListener('resize', function () {
                    _this.canvasRect = _this.canvas.getBoundingClientRect();
                });
                return [2];
            });
        });
    };
    EventsManager.prototype.clear = function () {
        var _this = this;
        Object.entries(this.events).forEach(function (_a) {
            var eventName = _a[0], fn = _a[1];
            _this.canvas.removeEventListener(eventName, fn, false);
        });
    };
    EventsManager.prototype.postUpdate = function () {
        var _this = this;
        this._previousKeysDown.clear();
        this._previousMousesDown.clear();
        this._wheelDelta = 0;
        this._previousMousePosition.set(this._mousePosition.x, this._mousePosition.y);
        this._keysDown.forEach(function (value, key) {
            _this._previousKeysDown.set(key, value);
        });
        this._mousesDown.forEach(function (value, key) {
            _this._previousMousesDown.set(key, value);
        });
    };
    EventsManager.prototype.isDown = function (map, key) {
        var _a;
        return (_a = map.get(key)) !== null && _a !== void 0 ? _a : false;
    };
    EventsManager.prototype.pressed = function (map, previousMap, key) {
        return this.isDown(map, key) && !this.isDown(previousMap, key);
    };
    EventsManager.prototype.released = function (map, previousMap, key) {
        return !this.isDown(map, key) && this.isDown(previousMap, key);
    };
    EventsManager.prototype.keyIsDown = function (key) {
        return this.isDown(this._keysDown, key);
    };
    EventsManager.prototype.keyPressed = function (key) {
        return this.pressed(this._keysDown, this._previousKeysDown, key);
    };
    EventsManager.prototype.keyReleased = function (key) {
        return this.released(this._keysDown, this._previousKeysDown, key);
    };
    EventsManager.prototype.mouseIsDown = function (mouse) {
        return this.isDown(this._mousesDown, mouse);
    };
    EventsManager.prototype.mousePressed = function (mouse) {
        return this.pressed(this._mousesDown, this._previousMousesDown, mouse);
    };
    EventsManager.prototype.isWheeling = function () {
        return this._wheelDelta !== 0;
    };
    EventsManager.prototype.wheelDelta = function (coefficient) {
        if (coefficient === void 0) { coefficient = 1; }
        return this._wheelDelta * coefficient;
    };
    EventsManager.prototype.isDragging = function (mouse) {
        if (this.mouseIsDown(mouse) && !this.mousePressed(mouse)) {
            var delta = this.dragDelta();
            return Math.abs(delta.x) + Math.abs(delta.y) > this._minDragDelta;
        }
        return false;
    };
    EventsManager.prototype.dragDelta = function () {
        return this._mousePosition.sub(this._previousMousePosition);
    };
    EventsManager.prototype.mouseReleased = function (mouse) {
        return this.released(this._mousesDown, this._previousMousesDown, mouse);
    };
    EventsManager.prototype.mousePosition = function (convertToWorldPosition) {
        if (convertToWorldPosition === void 0) { convertToWorldPosition = true; }
        if (!convertToWorldPosition || !this.ecs.systems.has(renderer_1.Renderer)) {
            return this._mousePosition;
        }
        var camera = this.ecs.system(renderer_1.Renderer).getCamera();
        return camera.screenToWorld(this._mousePosition);
    };
    return EventsManager;
}(core_1.Manager));
exports["default"] = EventsManager;
//# sourceMappingURL=EventsManager.js.map

/***/ }),

/***/ "../game/lib/game.js":
/*!***************************!*\
  !*** ../game/lib/game.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createLoadingScene = exports.createGame = exports.Game = exports.GameLoop = exports.Scene = void 0;
var Scene_1 = __webpack_require__(/*! ./objects/Scene */ "../game/lib/objects/Scene.js");
Object.defineProperty(exports, "Scene", ({ enumerable: true, get: function () { return __importDefault(Scene_1).default; } }));
var GameLoop_1 = __webpack_require__(/*! ./objects/GameLoop */ "../game/lib/objects/GameLoop.js");
Object.defineProperty(exports, "GameLoop", ({ enumerable: true, get: function () { return __importDefault(GameLoop_1).default; } }));
var Game_1 = __webpack_require__(/*! ./objects/Game */ "../game/lib/objects/Game.js");
Object.defineProperty(exports, "Game", ({ enumerable: true, get: function () { return __importDefault(Game_1).default; } }));
var createGame_1 = __webpack_require__(/*! ./objects/createGame */ "../game/lib/objects/createGame.js");
Object.defineProperty(exports, "createGame", ({ enumerable: true, get: function () { return __importDefault(createGame_1).default; } }));
var createLoadingScene_1 = __webpack_require__(/*! ./util/createLoadingScene */ "../game/lib/util/createLoadingScene.js");
Object.defineProperty(exports, "createLoadingScene", ({ enumerable: true, get: function () { return __importDefault(createLoadingScene_1).default; } }));
//# sourceMappingURL=game.js.map

/***/ }),

/***/ "../game/lib/managers/CameraMovementManager.js":
/*!*****************************************************!*\
  !*** ../game/lib/managers/CameraMovementManager.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var CameraMovementManager = (function (_super) {
    __extends(CameraMovementManager, _super);
    function CameraMovementManager() {
        var _this = _super.call(this, 'CameraMovementManager') || this;
        _this.debugKey = events_1.Key.Control;
        return _this;
    }
    CameraMovementManager.prototype.update = function () {
        if (!this.ecs.managers.has(events_1.EventsManager) ||
            !this.ecs.systems.has(renderer_1.Renderer)) {
            return;
        }
        var events = this.ecs.manager(events_1.EventsManager);
        var camera = this.ecs.system(renderer_1.Renderer).getCamera();
        if (events.keyReleased(this.debugKey)) {
            camera.targetEntity(this.entityToFollow);
        }
        if (events.keyPressed(this.debugKey)) {
            this.entityToFollow = camera.getTargetEntity();
            camera.targetEntity();
        }
        if (!events.keyIsDown(this.debugKey)) {
            return;
        }
        if (events.isDragging(events_1.MouseButton.Left)) {
            camera.move(events.dragDelta().times(-1), true);
        }
        if (events.keyIsDown(events_1.Key.Shift) && events.mousePressed(events_1.MouseButton.Left)) {
            camera.lookat(events.mousePosition());
        }
        if (events.isWheeling()) {
            camera.zoom(events.wheelDelta(-0.001));
        }
        if (events.keyPressed(events_1.Key.r)) {
            camera.lookat(math_1.Vec2.zero());
            camera.scale = 1;
        }
    };
    return CameraMovementManager;
}(core_1.Manager));
exports["default"] = CameraMovementManager;
//# sourceMappingURL=CameraMovementManager.js.map

/***/ }),

/***/ "../game/lib/managers/PhysicDebugManager.js":
/*!**************************************************!*\
  !*** ../game/lib/managers/PhysicDebugManager.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var physic2d_1 = __webpack_require__(/*! @mythor/physic2d */ "../physic2d/lib/physic2d.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var renderPoly_1 = __importDefault(__webpack_require__(/*! ../util/renderPoly */ "../game/lib/util/renderPoly.js"));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var PhysicDebugManager = (function (_super) {
    __extends(PhysicDebugManager, _super);
    function PhysicDebugManager() {
        var _this = _super.call(this, 'PhysicDebugManager') || this;
        _this.show = false;
        _this.fill = false;
        return _this;
    }
    PhysicDebugManager.prototype.update = function () {
        if (!this.ecs.managers.has(events_1.EventsManager) ||
            !this.ecs.systems.has(physic2d_1.PhysicSystem)) {
            return;
        }
        var events = this.ecs.manager(events_1.EventsManager);
        if (events.keyPressed(events_1.Key.F4)) {
            this.show = !this.show;
        }
        if (!this.show) {
            return;
        }
        if (events.keyIsDown(events_1.Key.Control) && events.keyPressed(events_1.Key.f)) {
            this.fill = !this.fill;
        }
        this.render();
    };
    PhysicDebugManager.prototype.render = function () {
        var _this = this;
        var physicSystem = this.ecs.system(physic2d_1.PhysicSystem);
        var worldScale = physicSystem.worldScale, world = physicSystem.world;
        this.ecs.system(renderer_1.Renderer).onDraw(function (renderer) {
            for (var body = world.getBodyList(); body; body = body.getNext()) {
                for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                    var shape = fixture.getShape();
                    switch (shape.m_type) {
                        case 'polygon': {
                            (0, renderPoly_1.default)(renderer, fixture, body, worldScale, _this.fill);
                            break;
                        }
                        case 'circle': {
                            _this.renderCircle(renderer, body, shape, worldScale);
                            break;
                        }
                    }
                }
            }
        });
    };
    PhysicDebugManager.prototype.renderCircle = function (renderer, body, shape, worldScale) {
        var p = body.getPosition();
        var pos = math_1.Vec2.create(p.x, p.y).times(worldScale);
        renderer[this.fill ? 'fillCircle' : 'strokeCircle'](pos, new math_1.Vec2(shape.m_radius * worldScale, shape.m_radius * worldScale), {
            color: body.getType() === 'static' ? renderer_1.colorGreen : renderer_1.colorRed,
            diagonal: true,
            width: 2 / renderer.getCamera().scale,
        });
    };
    return PhysicDebugManager;
}(core_1.Manager));
exports["default"] = PhysicDebugManager;
//# sourceMappingURL=PhysicDebugManager.js.map

/***/ }),

/***/ "../game/lib/managers/RendererDebugManager.js":
/*!****************************************************!*\
  !*** ../game/lib/managers/RendererDebugManager.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var RendererDebugManager = (function (_super) {
    __extends(RendererDebugManager, _super);
    function RendererDebugManager() {
        var _this = _super.call(this, 'RendererDebugManager') || this;
        _this.show = false;
        return _this;
    }
    RendererDebugManager.prototype.update = function () {
        if (!this.ecs.managers.has(events_1.EventsManager) ||
            !this.ecs.systems.has(renderer_1.Renderer)) {
            return;
        }
        if (!this.ecs.system(renderer_1.Renderer).useTree) {
            return;
        }
        var events = this.ecs.manager(events_1.EventsManager);
        if (events.keyPressed(events_1.Key.F5)) {
            this.show = !this.show;
        }
        if (!this.show) {
            return;
        }
        this.render();
    };
    RendererDebugManager.prototype.offsetCamera = function (vec) {
        var renderer = this.ecs.system(renderer_1.Renderer);
        return vec.add(math_1.Vec2.create(5 / renderer.getCamera().scale, 10 / renderer.getCamera().scale));
    };
    RendererDebugManager.prototype.isTopLeft = function (q) {
        if (!q.parent) {
            return true;
        }
        return q.parent.leaves[0] === q;
    };
    RendererDebugManager.prototype.drawQuadTree = function (renderer, quadTree) {
        var _this = this;
        var q = quadTree !== null && quadTree !== void 0 ? quadTree : renderer.getEntities().quadTree;
        var isTopLeft = this.isTopLeft(q);
        var color = isTopLeft ? renderer_1.colorBlue : renderer_1.colorWhite;
        renderer.strokeRect(q.rect.position, q.rect.size, {
            color: color,
            width: 1 / renderer.getCamera().scale,
        });
        if (q.rect.size.x > renderer.fov.size.x / 6) {
            var fontSize = 0.7 / renderer.getCamera().scale;
            var pos = this.offsetCamera(q.rect.position.sub(q.rect.size.divide(2)));
            var str = "".concat(this.prettyRect(q.rect, true), "\nDepth:").concat(q.depth, "\nItems:").concat(q.itemLength, "\nLeaves:").concat(q.leaves.length);
            var lines = str.split('\n');
            var lineNumber = lines.length;
            var lineHeight = renderer.lineHeight();
            var offset = q.depth * (lineNumber + 1) * lineHeight * fontSize;
            renderer.text(isTopLeft ? pos.add(math_1.Vec2.create(0, offset)) : pos, str, {
                color: color,
                size: fontSize,
            });
        }
        q.leaves.forEach(function (child) { return _this.drawQuadTree(renderer, child); });
    };
    RendererDebugManager.prototype.prettyRect = function (rect, newLine) {
        if (newLine === void 0) { newLine = false; }
        if (newLine) {
            return "position:\n".concat(rect.position.toString(), "\nsize:\n").concat(rect.size.toString());
        }
        return "position: ".concat(rect.position.toString(), "\nsize:   ").concat(rect.size.toString());
    };
    RendererDebugManager.prototype.render = function () {
        var _this = this;
        this.ecs.system(renderer_1.Renderer).onDraw(function (renderer) {
            var fov = renderer.fov;
            var topLeft = _this.offsetCamera((0, math_1.getTopLeft)(fov));
            renderer.text(topLeft, _this.prettyRect(fov) + "\nscale: ".concat(renderer.getCamera().scale), { color: renderer_1.colorRed, size: 0.7 / renderer.getCamera().scale });
            renderer.strokeRect(fov.position, fov.size, {
                color: renderer_1.colorRed,
                width: 1 / renderer.getCamera().scale,
            });
            _this.drawQuadTree(renderer);
        });
    };
    return RendererDebugManager;
}(core_1.Manager));
exports["default"] = RendererDebugManager;
//# sourceMappingURL=RendererDebugManager.js.map

/***/ }),

/***/ "../game/lib/managers/SceneManager.js":
/*!********************************************!*\
  !*** ../game/lib/managers/SceneManager.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var SceneManager = (function () {
    function SceneManager() {
        this._stack = [];
        if (SceneManager.instance) {
            return SceneManager.instance;
        }
        SceneManager.instance = this;
    }
    Object.defineProperty(SceneManager.prototype, "stack", {
        get: function () {
            var copy = __spreadArray([], this._stack, true);
            Object.freeze(copy);
            return copy;
        },
        enumerable: false,
        configurable: true
    });
    SceneManager.getInstance = function () {
        if (!SceneManager.instance) {
            return new SceneManager();
        }
        return SceneManager.instance;
    };
    SceneManager.prototype.push = function () {
        var _this = this;
        var scenes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scenes[_i] = arguments[_i];
        }
        scenes.forEach(function (scene) {
            _this.pushOne(scene);
        });
        return this;
    };
    SceneManager.prototype.swap = function (first, second) {
        if (first === void 0) { first = 0; }
        if (second === void 0) { second = 1; }
        if (first >= second) {
            (0, core_1.log)('Cannot swap with itself');
            return this;
        }
        if (!this._stack[second] || !this._stack[first]) {
            (0, core_1.log)('Cannot swap with non existing scenes');
            return this;
        }
        var tmp = this._stack[second];
        this._stack[second] = this._stack[first];
        this._stack[first] = tmp;
        if (first === 0) {
            this._stack[second].stop();
            this._stack[first].start();
        }
        return this;
    };
    SceneManager.prototype.pushOne = function (scene) {
        if (this.isEmpty()) {
            scene.start();
        }
        this._stack.push(scene);
        return this;
    };
    SceneManager.prototype.isEmpty = function () {
        return this._stack.length <= 0;
    };
    SceneManager.prototype.getFirst = function () {
        if (!this._stack.length) {
            return null;
        }
        return this._stack[0];
    };
    SceneManager.prototype.getNext = function () {
        if (this._stack.length > 1) {
            return this._stack[1];
        }
    };
    SceneManager.prototype.isNextReady = function () {
        var scene = this.getNext();
        if (!scene) {
            return false;
        }
        return scene.isReady();
    };
    SceneManager.prototype.next = function () {
        var _a, _b;
        (_a = this.getFirst()) === null || _a === void 0 ? void 0 : _a.stop();
        this._stack.shift();
        (_b = this.getFirst()) === null || _b === void 0 ? void 0 : _b.start();
        return this;
    };
    return SceneManager;
}());
exports["default"] = SceneManager;
//# sourceMappingURL=SceneManager.js.map

/***/ }),

/***/ "../game/lib/managers/SelectDebugManager.js":
/*!**************************************************!*\
  !*** ../game/lib/managers/SelectDebugManager.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var physic2d_1 = __webpack_require__(/*! @mythor/physic2d */ "../physic2d/lib/physic2d.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var getEntityStats_1 = __importDefault(__webpack_require__(/*! ../util/getEntityStats */ "../game/lib/util/getEntityStats.js"));
var SelectDebugManager = (function (_super) {
    __extends(SelectDebugManager, _super);
    function SelectDebugManager(params) {
        var _this = this;
        var _a;
        _this = _super.call(this, 'SelectDebugManager') || this;
        _this.show = false;
        _this.onSelect = params === null || params === void 0 ? void 0 : params.onSelect;
        _this.debugSize = (_a = params === null || params === void 0 ? void 0 : params.debugSize) !== null && _a !== void 0 ? _a : 0.7;
        return _this;
    }
    SelectDebugManager.prototype.update = function () {
        var _this = this;
        if (!this.ecs.managers.has(events_1.EventsManager) ||
            !this.ecs.systems.has(renderer_1.Renderer) ||
            !this.ecs.systems.has(physic2d_1.PhysicSystem)) {
            return;
        }
        var events = this.ecs.manager(events_1.EventsManager);
        if (events.keyPressed(events_1.Key.F6)) {
            this.show = !this.show;
        }
        if (!this.show) {
            return;
        }
        if (events.mousePressed(events_1.MouseButton.Left)) {
            var found_1 = false;
            this.ecs.system(physic2d_1.PhysicSystem).query(events.mousePosition(), function (entity) {
                var _a;
                if (entity.has(renderer_1.Renderable) && entity.has(core_1.Transform)) {
                    _this.selectedEntity = entity;
                    (_a = _this.onSelect) === null || _a === void 0 ? void 0 : _a.call(_this, entity);
                    found_1 = true;
                    return false;
                }
                return true;
            });
            if (!found_1) {
                this.selectedEntity = null;
            }
        }
        if (events.mousePressed(events_1.MouseButton.Right)) {
            this.selectedEntity = null;
        }
        this.render();
    };
    SelectDebugManager.prototype.offsetCamera = function (vec) {
        var renderer = this.ecs.system(renderer_1.Renderer);
        return vec.add(math_1.Vec2.create(5 / renderer.getCamera().scale, 10 / renderer.getCamera().scale));
    };
    SelectDebugManager.prototype.render = function () {
        var _this = this;
        this.ecs.system(renderer_1.Renderer).onDraw(function (renderer) {
            if (_this.selectedEntity) {
                var _a = _this.selectedEntity.get(core_1.Transform), position = _a.position, size = _a.size, rotation = _a.rotation;
                renderer.strokeRect(position, size, {
                    color: renderer_1.colorRed,
                    rotation: rotation,
                    width: (_this.debugSize * 3) / renderer.getCamera().scale,
                });
            }
            var fov = renderer.fov;
            var topLeft = _this.offsetCamera((0, math_1.getTopLeft)(fov));
            var entityStats = _this.selectedEntity
                ? (0, getEntityStats_1.default)(_this.selectedEntity)
                : 'No selected entity';
            var linesNumber = entityStats.split('\n').length + 1;
            var maskSize = math_1.Vec2.create(550 * _this.debugSize, linesNumber * renderer.lineHeight() * _this.debugSize).divide(renderer.getCamera().scale);
            renderer.fillRect((0, math_1.getTopLeft)(fov).add(maskSize.divide(2)), maskSize, {
                color: [0, 0, 0, 0.75],
            });
            renderer.text(topLeft, entityStats, {
                color: renderer_1.colorWhite,
                size: _this.debugSize / renderer.getCamera().scale,
            });
        });
    };
    return SelectDebugManager;
}(core_1.Manager));
exports["default"] = SelectDebugManager;
//# sourceMappingURL=SelectDebugManager.js.map

/***/ }),

/***/ "../game/lib/managers/StatisticsManager.js":
/*!*************************************************!*\
  !*** ../game/lib/managers/StatisticsManager.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var stats_js_1 = __importDefault(__webpack_require__(/*! stats.js */ "../../node_modules/stats.js/build/stats.min.js"));
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var objectToTable = function (objs) {
    var _a;
    return "\n  <table>\n    <thead>\n        <tr>\n            ".concat(Object.keys((_a = objs[0]) !== null && _a !== void 0 ? _a : [])
        .map(function (key) { return "<th style=\"padding: 5px\">".concat(key, "</th>"); })
        .join('\n'), "\n        </tr>\n    </thead>\n    <tbody>\n        ").concat(objs
        .map(function (obj) { return "\n            <tr>\n                ".concat(Object.values(obj)
        .map(function (value) {
        return "<td style=\"padding: 5px\">".concat(value.toString(), "</td>");
    })
        .join('\n'), "\n            </tr>\n        "); })
        .join('\n'), "\n    </tbody>\n  </table>\n  ");
};
var box = function (name, content) { return "\n  <div>\n    <h3>".concat(name, "</h3>\n    <div>").concat(content, "</div>\n  </div>\n"); };
var StatisticsManager = (function (_super) {
    __extends(StatisticsManager, _super);
    function StatisticsManager(params) {
        var _this = this;
        var _a;
        _this = _super.call(this, 'StatisticsManager') || this;
        _this.count = 0;
        _this.display = false;
        _this.count = 0;
        _this.stats = new stats_js_1.default();
        _this.stats.dom.style.left = 'auto';
        _this.stats.dom.style.right = '0';
        _this.entityPanel = _this.stats.addPanel(new stats_js_1.default.Panel('Entities', '#0ff', '#002'));
        _this.stats.showPanel(0);
        document.body.appendChild(_this.stats.dom);
        var elem = document.getElementById((_a = params === null || params === void 0 ? void 0 : params.debugElementId) !== null && _a !== void 0 ? _a : 'statistics');
        if (elem) {
            _this.elem = elem;
        }
        return _this;
    }
    StatisticsManager.prototype.toggleDisplay = function () {
        this.count = -1;
        this.display = !this.display;
        if (!this.display && this.elem) {
            this.elem.innerHTML = '';
        }
    };
    StatisticsManager.prototype.postUpdate = function () {
        this.stats.end();
    };
    StatisticsManager.prototype.update = function (ecs) {
        if (!ecs.managers.has(events_1.EventsManager)) {
            return;
        }
        if (ecs.manager(events_1.EventsManager).keyPressed(events_1.Key.F3)) {
            this.toggleDisplay();
        }
        this.entityPanel.update(ecs.getEntityNumber(), 2000);
        this.stats.begin();
        this.count++;
        if (!this.elem || !this.display || this.count % 20) {
            return;
        }
        this.count = 0;
        var systemStats = this.getSystemStats(ecs);
        var managerStats = this.getManagerStats(ecs);
        var componentStats = this.getComponentStats(ecs);
        var listStats = this.getListStats(ecs);
        this.elem.innerHTML =
            box('Managers:', objectToTable(managerStats)) +
                box('Systems:', objectToTable(systemStats)) +
                box('Lists:', objectToTable(listStats)) +
                box('Components:', objectToTable(componentStats));
    };
    StatisticsManager.prototype.getComponentStats = function (ecs) {
        return ecs.entityCollections.componentRegistry.constructors.map(function (constructor) {
            var _a;
            return ({
                id: (_a = constructor.signature) !== null && _a !== void 0 ? _a : -1,
                name: constructor.name,
            });
        });
    };
    StatisticsManager.prototype.getManagerStats = function (ecs) {
        return ecs.managers
            .map(function (m) { return ({
            id: (0, core_1.getSignature)((0, core_1.getConstructor)(m)),
            name: m.name,
        }); })
            .sort(function (a, b) { return (a.id < b.id ? -1 : 1); });
    };
    StatisticsManager.prototype.getListStats = function (ecs) {
        return Object.entries(ecs.entityCollections.lists)
            .map(function (_a) {
            var _b;
            var id = _a[0], list = _a[1];
            return ({
                id: id,
                components: (_b = list.constructors
                    .map(function (c) { return c.name; })
                    .sort(function (a, b) { return (a < b ? -1 : 1); })
                    .join(', ')) !== null && _b !== void 0 ? _b : '',
            });
        })
            .sort(function (a, b) { return (a.id < b.id ? -1 : 1); });
    };
    StatisticsManager.prototype.getSystemStats = function (ecs) {
        return __spreadArray(__spreadArray([], ecs.systems
            .map(function (system) { return ({
            id: (0, core_1.getSignature)((0, core_1.getConstructor)(system)),
            name: system.name,
            list: system.getEntities().signature,
            time: "".concat(system.duration.toFixed(2), " ms"),
        }); })
            .sort(function (a, b) { return (a.id < b.id ? -1 : 1); }), true), [
            {
                name: 'Total',
                id: 0,
                list: '',
                time: "".concat(ecs.duration.toFixed(2), " ms"),
            },
        ], false);
    };
    return StatisticsManager;
}(core_1.Manager));
exports["default"] = StatisticsManager;
//# sourceMappingURL=StatisticsManager.js.map

/***/ }),

/***/ "../game/lib/objects/Game.js":
/*!***********************************!*\
  !*** ../game/lib/objects/Game.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var GameLoop_1 = __importDefault(__webpack_require__(/*! ./GameLoop */ "../game/lib/objects/GameLoop.js"));
var SceneManager_1 = __importDefault(__webpack_require__(/*! ../managers/SceneManager */ "../game/lib/managers/SceneManager.js"));
var Game = (function () {
    function Game() {
        var scenes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scenes[_i] = arguments[_i];
        }
        this.sceneManager = new SceneManager_1.default();
        this._gameloop = new GameLoop_1.default();
        scenes.forEach(this.addScene.bind(this));
        this._gameloop.onUpdate(this.onUpdate.bind(this));
    }
    Object.defineProperty(Game.prototype, "gameloop", {
        get: function () {
            return this._gameloop;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.addScene = function (scene) {
        this.sceneManager.push(scene);
        return this;
    };
    Game.prototype.onUpdate = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        var scene = this.sceneManager.getFirst();
        if (scene) {
            scene.update(elapsedTimeInSeconds, totalTimeInSeconds);
        }
    };
    Game.prototype.start = function () {
        this._gameloop.start();
        return this;
    };
    return Game;
}());
exports["default"] = Game;
//# sourceMappingURL=Game.js.map

/***/ }),

/***/ "../game/lib/objects/GameLoop.js":
/*!***************************************!*\
  !*** ../game/lib/objects/GameLoop.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var GameLoop = (function () {
    function GameLoop() {
        this._previousTime = 0;
        this._started = false;
        this._stopped = false;
        this._shouldStop = false;
        this._paused = false;
        this._requestId = 0;
    }
    GameLoop.prototype.update = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        var _a;
        (_a = this._onUpdate) === null || _a === void 0 ? void 0 : _a.call(this, elapsedTimeInSeconds, totalTimeInSeconds);
    };
    GameLoop.prototype.onUpdate = function (fn) {
        this._onUpdate = fn;
    };
    GameLoop.prototype.onStop = function (fn) {
        this._onStop = fn;
    };
    GameLoop.prototype.loop = function (time) {
        var _a;
        if (time === void 0) { time = 0; }
        if (this._stopped) {
            return;
        }
        if (this._shouldStop) {
            this._stopped = true;
            cancelAnimationFrame(this._requestId);
            (_a = this._onStop) === null || _a === void 0 ? void 0 : _a.call(this);
            return;
        }
        if (!this._started) {
            throw new Error('Please call start()');
        }
        var elapsedTime = time - this._previousTime;
        this._previousTime = time;
        this.update(this._paused ? 0 : elapsedTime / 1000, time / 1000);
        this._requestId = requestAnimationFrame(this.loop.bind(this));
    };
    GameLoop.prototype.start = function () {
        if (this._started) {
            throw new Error('You cannot start a GameLoop multiple times');
        }
        this._started = true;
        this._paused = false;
        this.loop();
    };
    GameLoop.prototype.pause = function () {
        this._paused = !this._paused;
    };
    GameLoop.prototype.stop = function () {
        this._shouldStop = true;
    };
    return GameLoop;
}());
exports["default"] = GameLoop;
//# sourceMappingURL=GameLoop.js.map

/***/ }),

/***/ "../game/lib/objects/Scene.js":
/*!************************************!*\
  !*** ../game/lib/objects/Scene.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Scene = (function () {
    function Scene(name, options) {
        var _a, _b;
        var _c, _d;
        this._ready = false;
        this._running = false;
        this.name = name;
        this.ecs = new core_1.Ecs({ queueEntities: false });
        (_a = this.ecs).registerManagers.apply(_a, ((_c = options === null || options === void 0 ? void 0 : options.managers) !== null && _c !== void 0 ? _c : []));
        (_b = this.ecs).registerSystems.apply(_b, ((_d = options === null || options === void 0 ? void 0 : options.systems) !== null && _d !== void 0 ? _d : []));
        this.init(options);
    }
    Scene.prototype.isReady = function () {
        return this._ready;
    };
    Scene.prototype.update = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        if (!this._ready || !this._running) {
            return;
        }
        this.ecs.update(elapsedTimeInSeconds, totalTimeInSeconds);
    };
    Scene.prototype.init = function (options) {
        var _this = this;
        void this.ecs
            .init()
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, ((_a = options === null || options === void 0 ? void 0 : options.onInit) === null || _a === void 0 ? void 0 : _a.call(options, this.ecs))];
                    case 1:
                        _b.sent();
                        return [2];
                }
            });
        }); })
            .then(function () {
            _this._ready = true;
        })
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, ((_a = options === null || options === void 0 ? void 0 : options.onLoaded) === null || _a === void 0 ? void 0 : _a.call(options, this.ecs))];
                    case 1:
                        _b.sent();
                        return [2];
                }
            });
        }); });
        return this;
    };
    Scene.prototype.start = function () {
        this._running = true;
    };
    Scene.prototype.stop = function () {
        this._running = false;
    };
    return Scene;
}());
exports["default"] = Scene;
//# sourceMappingURL=Scene.js.map

/***/ }),

/***/ "../game/lib/objects/createGame.js":
/*!*****************************************!*\
  !*** ../game/lib/objects/createGame.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Scene_1 = __importDefault(__webpack_require__(/*! ./Scene */ "../game/lib/objects/Scene.js"));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Game_1 = __importDefault(__webpack_require__(/*! ./Game */ "../game/lib/objects/Game.js"));
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var CameraMovementManager_1 = __importDefault(__webpack_require__(/*! ../managers/CameraMovementManager */ "../game/lib/managers/CameraMovementManager.js"));
var StatisticsManager_1 = __importDefault(__webpack_require__(/*! ../managers/StatisticsManager */ "../game/lib/managers/StatisticsManager.js"));
var PhysicDebugManager_1 = __importDefault(__webpack_require__(/*! ../managers/PhysicDebugManager */ "../game/lib/managers/PhysicDebugManager.js"));
var SelectDebugManager_1 = __importDefault(__webpack_require__(/*! ../managers/SelectDebugManager */ "../game/lib/managers/SelectDebugManager.js"));
var RendererDebugManager_1 = __importDefault(__webpack_require__(/*! ../managers/RendererDebugManager */ "../game/lib/managers/RendererDebugManager.js"));
var createLoadingScene_1 = __importDefault(__webpack_require__(/*! ../util/createLoadingScene */ "../game/lib/util/createLoadingScene.js"));
var defaultManagers = [
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addLoadingStateManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function () { return new core_1.LoadingStateManager(); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addEventsManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function (options) { var _a; return new events_1.EventsManager((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.eventsManager); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addCameraMovementManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function () { return new CameraMovementManager_1.default(); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addStatisticsManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function (options) { var _a; return new StatisticsManager_1.default((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.statisticsManager); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addPhysicDebugManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function () { return new PhysicDebugManager_1.default(); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addSelectDebugManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function (options) { var _a; return new SelectDebugManager_1.default((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.selectDebugManager); },
    },
    {
        condition: function (options) { var _a; return (_a = options === null || options === void 0 ? void 0 : options.addRendererDebugManager) !== null && _a !== void 0 ? _a : true; },
        getItem: function () { return new RendererDebugManager_1.default(); },
    },
];
function getManagers(options) {
    var _a;
    var managers = (_a = options.managers) !== null && _a !== void 0 ? _a : [];
    defaultManagers.forEach(function (_a) {
        var condition = _a.condition, getItem = _a.getItem;
        if (condition(options)) {
            managers.push(getItem(options));
        }
    });
    return managers;
}
function createGame(options) {
    var _this = this;
    return new Game_1.default()
        .addScene((0, createLoadingScene_1.default)(options === null || options === void 0 ? void 0 : options.camera))
        .addScene(new Scene_1.default('Mainscene', __assign(__assign({}, options), { managers: getManagers(options), onLoaded: function (ecs) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = options === null || options === void 0 ? void 0 : options.onLoaded) === null || _a === void 0 ? void 0 : _a.call(options, ecs);
                if (ecs.managers.has(core_1.LoadingStateManager)) {
                    ecs.managers.delete(core_1.LoadingStateManager);
                }
                return [2];
            });
        }); } })))
        .start();
}
exports["default"] = createGame;
//# sourceMappingURL=createGame.js.map

/***/ }),

/***/ "../game/lib/util/createLoadingScene.js":
/*!**********************************************!*\
  !*** ../game/lib/util/createLoadingScene.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var SceneManager_1 = __importDefault(__webpack_require__(/*! ../managers/SceneManager */ "../game/lib/managers/SceneManager.js"));
var Scene_1 = __importDefault(__webpack_require__(/*! ../objects/Scene */ "../game/lib/objects/Scene.js"));
var events_1 = __webpack_require__(/*! @mythor/events */ "../events/lib/events.js");
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading(options) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, 'Loading') || this;
        _this.color = (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : renderer_1.colorWhite;
        _this.loadingBarWidth = (_b = options === null || options === void 0 ? void 0 : options.loadingBarWidth) !== null && _b !== void 0 ? _b : 0.8;
        _this.loadingBarHeight = (_c = options === null || options === void 0 ? void 0 : options.loadingBarHeight) !== null && _c !== void 0 ? _c : 10;
        _this.loadingBarPosHeight = (_d = options === null || options === void 0 ? void 0 : options.loadingBarPosHeight) !== null && _d !== void 0 ? _d : 0.7;
        return _this;
    }
    Loading.prototype.update = function () {
        var isNextReady = SceneManager_1.default.getInstance().isNextReady();
        if (isNextReady) {
            this.updateWhenReady();
        }
        else {
            this.updateWhenNotReady();
        }
    };
    Loading.prototype.updateWhenNotReady = function () {
        var loadingManager = this.getNextLoadingManager();
        if (!loadingManager) {
            return;
        }
        var percentage = loadingManager.getLoadingPercentage();
        var detail = loadingManager.getLoadingDetail();
        this.renderLoadingBar(percentage, detail);
    };
    Loading.prototype.updateWhenReady = function () {
        this.ecs.system(renderer_1.Renderer).disabled(true);
        SceneManager_1.default.getInstance().next();
    };
    Loading.prototype.getNextLoadingManager = function () {
        var scene = SceneManager_1.default.getInstance().getNext();
        if (!scene) {
            return null;
        }
        if (!scene.ecs.managers.has(core_1.LoadingStateManager)) {
            return null;
        }
        return scene.ecs.manager(core_1.LoadingStateManager);
    };
    Loading.prototype.renderLoadingBar = function (percentage, detail) {
        var _this = this;
        this.ecs.system(renderer_1.Renderer).onDraw(function (renderer) {
            var cameraSize = renderer.getCamera().getSize();
            var width = cameraSize.x * _this.loadingBarWidth;
            var posHeight = cameraSize.y * 0.5 * _this.loadingBarPosHeight;
            renderer.strokeRect(new math_1.Vec2(0, posHeight), new math_1.Vec2(width, _this.loadingBarHeight), {
                color: _this.color,
            });
            var filledWidth = width * percentage * 0.01;
            renderer.fillRect(new math_1.Vec2(0 - (width - filledWidth) / 2, posHeight), new math_1.Vec2(filledWidth, _this.loadingBarHeight), {
                color: _this.color,
            });
            renderer.text(new math_1.Vec2(-width / 2, posHeight - _this.loadingBarHeight - 20), detail ? "Loading: ".concat(detail) : 'Loading...', {
                color: _this.color,
            });
        });
    };
    return Loading;
}(core_1.Manager));
function createLoadingScene(camera) {
    var _this = this;
    return new Scene_1.default('CreateLoadingScene', {
        managers: [new events_1.EventsManager(), new Loading()],
        onInit: function (ecs) { return __awaiter(_this, void 0, void 0, function () {
            var cameraSize;
            return __generator(this, function (_a) {
                cameraSize = ecs.system(renderer_1.Renderer).getCamera().getSize();
                ecs.create().add(new renderer_1.Renderable(), new renderer_1.FillRect(), new core_1.Transform({
                    position: new math_1.Vec2(0, -cameraSize.y * 0.5 * 0.2),
                }));
                return [2];
            });
        }); },
        systems: [new renderer_1.Renderer({ camera: camera })],
    });
}
exports["default"] = createLoadingScene;
//# sourceMappingURL=createLoadingScene.js.map

/***/ }),

/***/ "../game/lib/util/getEntityStats.js":
/*!******************************************!*\
  !*** ../game/lib/util/getEntityStats.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var getEntityStats = function (entity) {
    var _a = entity.get(core_1.Transform), position = _a.position, size = _a.size, rotation = _a.rotation;
    return JSON.stringify({
        id: entity._id,
        transform: {
            position: {
                x: position.x,
                y: position.y,
            },
            size: {
                x: size.x,
                y: size.y,
            },
            rotation: rotation,
        },
        components: entity.components.map(function (c) { return c.constructor.name; }),
    }, null, 1);
};
exports["default"] = getEntityStats;
//# sourceMappingURL=getEntityStats.js.map

/***/ }),

/***/ "../game/lib/util/renderPoly.js":
/*!**************************************!*\
  !*** ../game/lib/util/renderPoly.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var renderer_1 = __webpack_require__(/*! @mythor/renderer */ "../renderer/lib/renderer.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var physic2d_1 = __webpack_require__(/*! @mythor/physic2d */ "../physic2d/lib/physic2d.js");
function renderPoly(renderer, fixture, body, worldScale, fill) {
    if (fill === void 0) { fill = false; }
    var shape = fixture.getShape();
    var vertices = shape.m_vertices;
    if (!vertices.length) {
        return;
    }
    var p = body.getPosition();
    var pos = math_1.Vec2.create(p.x, p.y).times(worldScale);
    var angle = body.getAngle();
    var poly = shape.m_vertices.map(function (v) {
        return math_1.Vec2.create(v.x, v.y).rotate(angle).times(worldScale);
    });
    var interactWithWorld = fixture.getFilterMaskBits() !== physic2d_1.IGNORED_BY_WORLD;
    renderer[fill ? 'fillPoly' : 'strokePoly'](pos, poly, {
        color: body.getType() === 'static'
            ? interactWithWorld
                ? renderer_1.colorGreen
                : [1, 1, 1, 0.25]
            : renderer_1.colorRed,
        diagonal: true,
        width: 2 / renderer.getCamera().scale,
    });
}
exports["default"] = renderPoly;
//# sourceMappingURL=renderPoly.js.map

/***/ }),

/***/ "../math/lib/Rect.js":
/*!***************************!*\
  !*** ../math/lib/Rect.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBottomRight = exports.getTopLeft = exports.overlaps = exports.contains = void 0;
var Vec2_1 = __webpack_require__(/*! ./Vec2 */ "../math/lib/Vec2.js");
var contains = function (rect, r) {
    var rMiddleposition = r.position, rsize = r.size;
    var middlePosition = rect.position, size = rect.size;
    var position = Vec2_1.default.sub(middlePosition, Vec2_1.default.divide(size, 2));
    var rposition = Vec2_1.default.sub(rMiddleposition, Vec2_1.default.divide(rsize, 2));
    return (rposition.x >= position.x &&
        rposition.x + r.size.x < position.x + size.x &&
        rposition.y >= position.y &&
        rposition.y + r.size.y < position.y + size.y);
};
exports.contains = contains;
var overlaps = function (rect, r) {
    var rMiddleposition = r.position, rsize = r.size;
    var middlePosition = rect.position, size = rect.size;
    var position = Vec2_1.default.sub(middlePosition, Vec2_1.default.divide(size, 2));
    var rposition = Vec2_1.default.sub(rMiddleposition, Vec2_1.default.divide(rsize, 2));
    return (position.x < rposition.x + r.size.x &&
        position.x + size.x >= rposition.x &&
        position.y < rposition.y + r.size.y &&
        position.y + size.y >= rposition.y);
};
exports.overlaps = overlaps;
var getTopLeft = function (rect) {
    return rect.position.sub(rect.size.divide(2));
};
exports.getTopLeft = getTopLeft;
var getBottomRight = function (rect) {
    return rect.position.add(rect.size.divide(2));
};
exports.getBottomRight = getBottomRight;
//# sourceMappingURL=Rect.js.map

/***/ }),

/***/ "../math/lib/Vec2.js":
/*!***************************!*\
  !*** ../math/lib/Vec2.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var util_1 = __webpack_require__(/*! ./util */ "../math/lib/util.js");
var Vec2 = (function () {
    function Vec2(x, y) {
        this._x = 0;
        this._y = 0;
        this._observers = [];
        this.set(x, y !== null && y !== void 0 ? y : x);
    }
    Object.defineProperty(Vec2.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this.triggerObservers();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this.triggerObservers();
        },
        enumerable: false,
        configurable: true
    });
    Vec2.prototype.triggerObservers = function () {
        var _this = this;
        if (this._observers.length === 0) {
            return;
        }
        this._observers.forEach(function (observer) { return observer(_this); });
    };
    Vec2.prototype.observe = function (cb) {
        this._observers.push(cb);
    };
    Vec2.create = function (x, y) {
        return new Vec2(x, y !== null && y !== void 0 ? y : x);
    };
    Vec2.zero = function () {
        return new Vec2(0, 0);
    };
    Vec2.prototype.set = function (x, y, triggerObservers) {
        if (triggerObservers === void 0) { triggerObservers = true; }
        this._x = x;
        this._y = y !== null && y !== void 0 ? y : x;
        if (triggerObservers) {
            this.triggerObservers();
        }
        return this;
    };
    Vec2.prototype.vSet = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vec2.prototype.times = function (n) {
        return new Vec2(this.x * n, this.y * n);
    };
    Vec2.times = function (v, n) {
        return v.times(n);
    };
    Vec2.prototype.vTimes = function (v) {
        return new Vec2(this.x * v.x, this.y * v.y);
    };
    Vec2.vTimes = function (v1, v2) {
        return v1.vTimes(v2);
    };
    Vec2.prototype.divide = function (n) {
        return this.times(1 / n);
    };
    Vec2.divide = function (v, n) {
        return v.divide(n);
    };
    Vec2.prototype.vDivide = function (v) {
        return new Vec2(this.x / v.x, this.y / v.y);
    };
    Vec2.vDivide = function (v1, v2) {
        return v1.vDivide(v2);
    };
    Vec2.prototype.add = function (v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    };
    Vec2.add = function (v1, v2) {
        return v1.add(v2);
    };
    Vec2.prototype.sub = function (v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    };
    Vec2.sub = function (v1, v2) {
        return v1.sub(v2);
    };
    Vec2.prototype.toAngle = function () {
        return Math.atan2(this.y, this.x);
    };
    Vec2.toAngle = function (v) {
        return v.toAngle();
    };
    Vec2.fromAngle = function (rad) {
        return new Vec2(Math.cos(rad), Math.sin(rad));
    };
    Vec2.prototype.rotate = function (rotationInRadians) {
        return new Vec2(this.x * Math.cos(rotationInRadians) -
            this.y * Math.sin(rotationInRadians), this.x * Math.sin(rotationInRadians) +
            this.y * Math.cos(rotationInRadians));
    };
    Vec2.rotate = function (v, rotationInRadians) {
        return v.rotate(rotationInRadians);
    };
    Vec2.prototype.distanceSquared = function (v2) {
        return (0, util_1.root)(this.x - v2.x) + (0, util_1.root)(this.y - v2.y);
    };
    Vec2.distanceSquared = function (v1, v2) {
        return v1.distanceSquared(v2);
    };
    Vec2.prototype.round = function (precision) {
        return this.set((0, util_1.round)(this.x, precision), (0, util_1.round)(this.y, precision));
    };
    Vec2.round = function (v, precision) {
        return v.set((0, util_1.round)(v.x, precision), (0, util_1.round)(v.y, precision));
    };
    Vec2.medium = function (vectors) {
        var sum = vectors.reduce(function (acc, curr) { return acc.add(curr); });
        return sum.divide(vectors.length);
    };
    Vec2.prototype.array = function () {
        return [this.x, this.y];
    };
    Vec2.prototype.toString = function () {
        return "{x:".concat(this.x.toFixed(2), ",y:").concat(this.y.toFixed(2), "}");
    };
    return Vec2;
}());
exports["default"] = Vec2;
//# sourceMappingURL=Vec2.js.map

/***/ }),

/***/ "../math/lib/math.js":
/*!***************************!*\
  !*** ../math/lib/math.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vec2 = void 0;
var Vec2_1 = __webpack_require__(/*! ./Vec2 */ "../math/lib/Vec2.js");
Object.defineProperty(exports, "Vec2", ({ enumerable: true, get: function () { return Vec2_1.default; } }));
__exportStar(__webpack_require__(/*! ./Rect */ "../math/lib/Rect.js"), exports);
__exportStar(__webpack_require__(/*! ./util */ "../math/lib/util.js"), exports);
//# sourceMappingURL=math.js.map

/***/ }),

/***/ "../math/lib/util.js":
/*!***************************!*\
  !*** ../math/lib/util.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPolygonCentroid = exports.moveTowards = exports.root = exports.lerp = exports.round = void 0;
var Vec2_1 = __webpack_require__(/*! ./Vec2 */ "../math/lib/Vec2.js");
var round = function (number, precision) {
    if (precision === void 0) { precision = 3; }
    var coef = Math.pow(10, precision);
    return Math.round(coef * number) / coef;
};
exports.round = round;
var lerp = function (value1, value2, amount) {
    if (amount === void 0) { amount = 0.5; }
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};
exports.lerp = lerp;
var root = function (value) { return value * value; };
exports.root = root;
var moveTowards = function (current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) {
        return target;
    }
    return current + Math.sign(target - current) * maxDelta;
};
exports.moveTowards = moveTowards;
var getPolygonCentroid = function (opts) {
    var pts = __spreadArray([], opts, true);
    var first = pts[0];
    var last = pts[pts.length - 1];
    if (first.x !== last.x || first.y !== last.y)
        pts.push(first);
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;
    var twicearea = 0;
    var x = 0;
    var y = 0;
    var nPts = pts.length;
    var p1;
    var p2;
    var f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        f = p1.x * p2.y - p2.x * p1.y;
        twicearea += f;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
        if (p1.x > maxX) {
            maxX = p1.x;
        }
        if (p1.x < minX) {
            minX = p1.x;
        }
        if (p1.y > maxY) {
            maxY = p1.y;
        }
        if (p1.y < minY) {
            minY = p1.y;
        }
        if (p2.x > maxX) {
            maxX = p2.x;
        }
        if (p2.x < minX) {
            minX = p2.x;
        }
        if (p2.y > maxY) {
            maxY = p2.y;
        }
        if (p2.y < minY) {
            minY = p2.y;
        }
    }
    f = twicearea * 3;
    return {
        centroid: new Vec2_1.default(x / f, y / f),
        size: new Vec2_1.default(Math.abs(maxX - minX), Math.abs(maxY - minY)),
    };
};
exports.getPolygonCentroid = getPolygonCentroid;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ "../physic2d/lib/components/ColliderCallback.js":
/*!******************************************************!*\
  !*** ../physic2d/lib/components/ColliderCallback.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var ColliderCallback = (function (_super) {
    __extends(ColliderCallback, _super);
    function ColliderCallback(options) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this) || this;
        _this.cb = options === null || options === void 0 ? void 0 : options.callback;
        _this.disableContact = (_a = options === null || options === void 0 ? void 0 : options.disableContact) !== null && _a !== void 0 ? _a : false;
        _this.sticky = (_b = options === null || options === void 0 ? void 0 : options.sticky) !== null && _b !== void 0 ? _b : false;
        _this.deleteOnContact = (_c = options === null || options === void 0 ? void 0 : options.deleteOnContact) !== null && _c !== void 0 ? _c : false;
        return _this;
    }
    ColliderCallback.prototype.callback = function (otherEntity, contact, contactPosition) {
        var _a;
        (_a = this.cb) === null || _a === void 0 ? void 0 : _a.call(this, this._entity, otherEntity, contact, contactPosition);
    };
    return ColliderCallback;
}(core_1.Component));
exports["default"] = ColliderCallback;
//# sourceMappingURL=ColliderCallback.js.map

/***/ }),

/***/ "../physic2d/lib/components/Physic.js":
/*!********************************************!*\
  !*** ../physic2d/lib/components/Physic.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicType = void 0;
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var PhysicType;
(function (PhysicType) {
    PhysicType["STATIC"] = "static";
    PhysicType["KINEMATIC"] = "kinematic";
    PhysicType["DYNAMIC"] = "dynamic";
})(PhysicType = exports.PhysicType || (exports.PhysicType = {}));
var Physic = (function (_super) {
    __extends(Physic, _super);
    function Physic(options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        _this = _super.call(this) || this;
        _this.type = (_a = options === null || options === void 0 ? void 0 : options.type) !== null && _a !== void 0 ? _a : PhysicType.STATIC;
        _this.mass = (_b = options === null || options === void 0 ? void 0 : options.mass) !== null && _b !== void 0 ? _b : 1;
        _this.fixedRotation = (_c = options === null || options === void 0 ? void 0 : options.fixedRotation) !== null && _c !== void 0 ? _c : false;
        _this.polygons = (_d = options === null || options === void 0 ? void 0 : options.polygons) !== null && _d !== void 0 ? _d : [];
        _this.size = (_e = options === null || options === void 0 ? void 0 : options.size) !== null && _e !== void 0 ? _e : undefined;
        _this.offset = (_f = options === null || options === void 0 ? void 0 : options.offset) !== null && _f !== void 0 ? _f : math_1.Vec2.zero();
        _this.friction = (_g = options === null || options === void 0 ? void 0 : options.friction) !== null && _g !== void 0 ? _g : 0.2;
        _this.restitution = (_h = options === null || options === void 0 ? void 0 : options.restitution) !== null && _h !== void 0 ? _h : 0;
        _this.density = (_j = options === null || options === void 0 ? void 0 : options.density) !== null && _j !== void 0 ? _j : 0;
        _this.linearDamping = (_k = options === null || options === void 0 ? void 0 : options.linearDamping) !== null && _k !== void 0 ? _k : 0;
        _this.bullet = (_l = options === null || options === void 0 ? void 0 : options.bullet) !== null && _l !== void 0 ? _l : false;
        _this.interactWithWorld = (_m = options === null || options === void 0 ? void 0 : options.interactWithWorld) !== null && _m !== void 0 ? _m : true;
        _this.initialLinearVelocity = (_o = options === null || options === void 0 ? void 0 : options.initialLinearVelocity) !== null && _o !== void 0 ? _o : math_1.Vec2.zero();
        _this.gravityScale = (_p = options === null || options === void 0 ? void 0 : options.gravityScale) !== null && _p !== void 0 ? _p : 1;
        _this.ellipses = (_q = options === null || options === void 0 ? void 0 : options.ellipses) !== null && _q !== void 0 ? _q : [];
        _this.filterCategoryBits = options === null || options === void 0 ? void 0 : options.filterCategoryBits;
        _this.filterMaskBits = options === null || options === void 0 ? void 0 : options.filterMaskBits;
        return _this;
    }
    return Physic;
}(core_1.Component));
exports["default"] = Physic;
//# sourceMappingURL=Physic.js.map

/***/ }),

/***/ "../physic2d/lib/physic2d.js":
/*!***********************************!*\
  !*** ../physic2d/lib/physic2d.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PhysicManipulator = exports.IGNORED_BY_WORLD = exports.PhysicSystem = exports.PhysicType = exports.Physic = exports.ColliderCallback = void 0;
var ColliderCallback_1 = __webpack_require__(/*! ./components/ColliderCallback */ "../physic2d/lib/components/ColliderCallback.js");
Object.defineProperty(exports, "ColliderCallback", ({ enumerable: true, get: function () { return ColliderCallback_1.default; } }));
var Physic_1 = __webpack_require__(/*! ./components/Physic */ "../physic2d/lib/components/Physic.js");
Object.defineProperty(exports, "Physic", ({ enumerable: true, get: function () { return Physic_1.default; } }));
Object.defineProperty(exports, "PhysicType", ({ enumerable: true, get: function () { return Physic_1.PhysicType; } }));
var PhysicSystem_1 = __webpack_require__(/*! ./systems/PhysicSystem */ "../physic2d/lib/systems/PhysicSystem.js");
Object.defineProperty(exports, "PhysicSystem", ({ enumerable: true, get: function () { return PhysicSystem_1.default; } }));
Object.defineProperty(exports, "IGNORED_BY_WORLD", ({ enumerable: true, get: function () { return PhysicSystem_1.IGNORED_BY_WORLD; } }));
var PhysicManipulator_1 = __webpack_require__(/*! ./utils/PhysicManipulator */ "../physic2d/lib/utils/PhysicManipulator.js");
Object.defineProperty(exports, "PhysicManipulator", ({ enumerable: true, get: function () { return PhysicManipulator_1.default; } }));
//# sourceMappingURL=physic2d.js.map

/***/ }),

/***/ "../physic2d/lib/systems/PhysicSystem.js":
/*!***********************************************!*\
  !*** ../physic2d/lib/systems/PhysicSystem.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IGNORED_BY_WORLD = void 0;
var planck_js_1 = __webpack_require__(/*! planck-js */ "../../node_modules/planck-js/lib/index.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Physic_1 = __webpack_require__(/*! ../components/Physic */ "../physic2d/lib/components/Physic.js");
var ColliderCallback_1 = __webpack_require__(/*! ../components/ColliderCallback */ "../physic2d/lib/components/ColliderCallback.js");
var lib_1 = __webpack_require__(/*! planck-js/lib */ "../../node_modules/planck-js/lib/index.js");
exports.IGNORED_BY_WORLD = parseInt('100', 2);
var PhysicSystem = (function (_super) {
    __extends(PhysicSystem, _super);
    function PhysicSystem(options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _this = _super.call(this, 'PhysicSystem', [core_1.Transform, Physic_1.default]) || this;
        _this.collisionsToMakeSticky = [];
        _this.worldScale = (_a = options === null || options === void 0 ? void 0 : options.worldScale) !== null && _a !== void 0 ? _a : 100;
        _this.world = (0, planck_js_1.World)({
            gravity: (0, planck_js_1.Vec2)((_c = (_b = options === null || options === void 0 ? void 0 : options.gravity) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0.0, (_e = (_d = options === null || options === void 0 ? void 0 : options.gravity) === null || _d === void 0 ? void 0 : _d.y) !== null && _e !== void 0 ? _e : 100),
        });
        return _this;
    }
    PhysicSystem.prototype.getEntitiesFromContact = function (contact) {
        var fA = contact.getFixtureA();
        var fB = contact.getFixtureB();
        var bA = fA.getBody();
        var bB = fB.getBody();
        var entityIdA = bA.getUserData().entityId;
        var entityIdB = bB.getUserData().entityId;
        var entityA = this.ecs.entity(entityIdA);
        var entityB = this.ecs.entity(entityIdB);
        return { entityA: entityA, entityB: entityB };
    };
    PhysicSystem.prototype.preSolve = function (contact) {
        var _a = this.getEntitiesFromContact(contact), entityA = _a.entityA, entityB = _a.entityB;
        if (!entityA || !entityB) {
            return;
        }
        if (entityA.has(core_1.Owner) && entityA.get(core_1.Owner).is(entityB)) {
            contact.setEnabled(false);
            return;
        }
        if (entityB.has(core_1.Owner) && entityB.get(core_1.Owner).is(entityA)) {
            contact.setEnabled(false);
            return;
        }
        if (entityA.has(ColliderCallback_1.default)) {
            this.applyColliderCallback(entityA, entityB, contact);
        }
        if (entityB.has(ColliderCallback_1.default)) {
            this.applyColliderCallback(entityB, entityA, contact);
        }
    };
    PhysicSystem.prototype.applyColliderCallback = function (entity, otherEntity, contact) {
        var _a;
        var colliderCallback = entity.get(ColliderCallback_1.default);
        if (colliderCallback.disableContact) {
            contact.setEnabled(false);
        }
        if (colliderCallback.deleteOnContact) {
            entity.destroy();
        }
        var points = (_a = contact.getWorldManifold(null)) === null || _a === void 0 ? void 0 : _a.points;
        var contactPosition = points
            ? math_1.Vec2.medium(points.map(function (_a) {
                var x = _a.x, y = _a.y;
                return math_1.Vec2.create(x, y);
            }))
            : undefined;
        if (colliderCallback.deleteOnContact || colliderCallback.sticky) {
            this.collisionsToMakeSticky.push({
                arrowBody: entity.get(Physic_1.default).body,
                contactPosition: contactPosition,
                targetBody: otherEntity.get(Physic_1.default).body,
            });
        }
        colliderCallback.callback(otherEntity, contact, contactPosition === null || contactPosition === void 0 ? void 0 : contactPosition.times(this.worldScale));
    };
    PhysicSystem.prototype.onSystemInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.world.on('pre-solve', this.preSolve.bind(this));
                return [2];
            });
        });
    };
    PhysicSystem.prototype.onEntityCreation = function (entity) {
        var _this = this;
        var _a, _b, _c, _d;
        var physic = entity.get(Physic_1.default);
        var fixedRotation = physic.fixedRotation, friction = physic.friction, mass = physic.mass, restitution = physic.restitution, density = physic.density, linearDamping = physic.linearDamping, bullet = physic.bullet, initialLinearVelocity = physic.initialLinearVelocity, gravityScale = physic.gravityScale, interactWithWorld = physic.interactWithWorld, filterCategoryBits = physic.filterCategoryBits, filterMaskBits = physic.filterMaskBits, type = physic.type;
        var _e = entity.get(core_1.Transform), _f = _e.size, width = _f.x, height = _f.y, position = _e.position, rotation = _e.rotation;
        var body = this.world.createBody({
            bullet: bullet,
            fixedRotation: fixedRotation,
            gravityScale: gravityScale,
            linearDamping: linearDamping,
            type: type,
        });
        var shapes = __spreadArray(__spreadArray([], physic.polygons.map(function (polygon) {
            return (0, lib_1.Polygon)(polygon.map(function (_a) {
                var x = _a.x, y = _a.y;
                return (0, planck_js_1.Vec2)(x / _this.worldScale, y / _this.worldScale);
            }));
        }), true), physic.ellipses.map(function (ellipse) { return (0, lib_1.Circle)(ellipse / _this.worldScale); }), true);
        if (shapes.length <= 0) {
            shapes.push((0, lib_1.Box)(((_b = (_a = physic === null || physic === void 0 ? void 0 : physic.size) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : width) / 2 / this.worldScale, ((_d = (_c = physic === null || physic === void 0 ? void 0 : physic.size) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : height) / 2 / this.worldScale));
        }
        shapes.forEach(function (shape) {
            body.createFixture({
                density: density,
                filterCategoryBits: filterCategoryBits !== null && filterCategoryBits !== void 0 ? filterCategoryBits : parseInt('010', 2),
                filterMaskBits: filterMaskBits !== null && filterMaskBits !== void 0 ? filterMaskBits : (interactWithWorld ? undefined : exports.IGNORED_BY_WORLD),
                friction: friction,
                restitution: restitution,
                shape: shape,
            });
        });
        body.setPosition((0, planck_js_1.Vec2)((position.x + physic.offset.x) / this.worldScale, (position.y + physic.offset.y) / this.worldScale));
        body.setAngle(rotation);
        body.setMassData({
            I: 1,
            center: (0, planck_js_1.Vec2)(),
            mass: mass,
        });
        body.setLinearVelocity((0, planck_js_1.Vec2)(initialLinearVelocity.x, initialLinearVelocity.y));
        body.setUserData({ entityId: entity._id });
        if (type !== Physic_1.PhysicType.STATIC) {
            position.observe(function (newPos) {
                body.setPosition((0, planck_js_1.Vec2)((newPos.x + physic.offset.x) / _this.worldScale, (newPos.y + physic.offset.y) / _this.worldScale));
            });
        }
        physic.body = body;
    };
    PhysicSystem.prototype.onEntityDestruction = function (entity) {
        if (!entity.get(Physic_1.default)) {
            return;
        }
        var physic = entity.get(Physic_1.default);
        this.world.destroyBody(physic.body);
    };
    PhysicSystem.prototype.update = function (elapsedTimeInSeconds) {
        var physic = null;
        var transform = null;
        this.world.step(elapsedTimeInSeconds);
        this.world.clearForces();
        for (var b = this.world.getBodyList(); b; b = b.getNext()) {
            var bodyPosition = b.getPosition();
            var bodyAngle = b.getAngle();
            var entityId = b.getUserData().entityId;
            var entity = this.ecs.entity(entityId);
            if (!entity) {
                continue;
            }
            transform = entity.get(core_1.Transform);
            physic = entity.get(Physic_1.default);
            transform.position.set(bodyPosition.x * this.worldScale - physic.offset.x, bodyPosition.y * this.worldScale - physic.offset.y);
            transform.rotation = bodyAngle;
        }
        while (this.collisionsToMakeSticky.length > 0) {
            var stickyInfo = this.collisionsToMakeSticky.shift();
            if (stickyInfo) {
                this.stick(stickyInfo);
            }
        }
    };
    PhysicSystem.prototype.query = function (point, onFound, continueToSearch) {
        var _this = this;
        if (continueToSearch === void 0) { continueToSearch = false; }
        var plankPoint = (0, planck_js_1.Vec2)(point.times(1 / this.worldScale));
        this.world.queryAABB((0, planck_js_1.AABB)(plankPoint, plankPoint), function (fixture) {
            var _a;
            var body = fixture.getBody();
            var entityId = body.getUserData().entityId;
            var entity = _this.ecs.entity(entityId);
            if (entity) {
                return (_a = onFound(entity)) !== null && _a !== void 0 ? _a : continueToSearch;
            }
            return continueToSearch;
        });
    };
    PhysicSystem.prototype.stick = function (si) {
        if (si.contactPosition) {
            si.arrowBody.setPosition((0, planck_js_1.Vec2)(si.contactPosition.x, si.contactPosition.y));
        }
        var worldCoordsAnchorPoint = si.arrowBody.getWorldPoint((0, planck_js_1.Vec2)(0, 0));
        this.world.createJoint((0, planck_js_1.WeldJoint)({
            bodyA: si.targetBody,
            bodyB: si.arrowBody,
            localAnchorA: si.targetBody.getLocalPoint(worldCoordsAnchorPoint),
            localAnchorB: si.arrowBody.getLocalPoint(worldCoordsAnchorPoint),
            localAxisA: (0, planck_js_1.Vec2)(0, 0),
            referenceAngle: si.arrowBody.getAngle() - si.targetBody.getAngle(),
        }));
    };
    return PhysicSystem;
}(core_1.System));
exports["default"] = PhysicSystem;
//# sourceMappingURL=PhysicSystem.js.map

/***/ }),

/***/ "../physic2d/lib/utils/PhysicManipulator.js":
/*!**************************************************!*\
  !*** ../physic2d/lib/utils/PhysicManipulator.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var toPlank_1 = __webpack_require__(/*! ./toPlank */ "../physic2d/lib/utils/toPlank.js");
var PhysicManipulator = (function () {
    function PhysicManipulator() {
    }
    PhysicManipulator.setVelocity = function (_a, velocity) {
        var body = _a.body;
        body.setLinearVelocity((0, toPlank_1.default)(velocity.x, velocity.y));
    };
    PhysicManipulator.getVelocity = function (_a) {
        var body = _a.body;
        var v = body.getLinearVelocity();
        return math_1.Vec2.create(v.x, v.y);
    };
    PhysicManipulator.addVelocity = function (_a, velocityToAdd) {
        var body = _a.body;
        var v = body.getLinearVelocity();
        v.x = velocityToAdd.x;
        v.y = velocityToAdd.y;
        body.setLinearVelocity(v);
    };
    PhysicManipulator.applyForce = function (_a, force) {
        var body = _a.body;
        var point = body.getWorldCenter();
        body.applyForce((0, toPlank_1.default)(force.x, force.y), point);
    };
    PhysicManipulator.applyImpulse = function (_a, impulse) {
        var body = _a.body;
        var point = body.getWorldCenter();
        body.applyLinearImpulse((0, toPlank_1.default)(impulse.x, impulse.y), point);
    };
    return PhysicManipulator;
}());
exports["default"] = PhysicManipulator;
//# sourceMappingURL=PhysicManipulator.js.map

/***/ }),

/***/ "../physic2d/lib/utils/toPlank.js":
/*!****************************************!*\
  !*** ../physic2d/lib/utils/toPlank.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var planck_js_1 = __webpack_require__(/*! planck-js */ "../../node_modules/planck-js/lib/index.js");
var toPlank = function (x, y) { return (0, planck_js_1.Vec2)(x, y); };
exports["default"] = toPlank;
//# sourceMappingURL=toPlank.js.map

/***/ }),

/***/ "../renderer/lib/color/Color.js":
/*!**************************************!*\
  !*** ../renderer/lib/color/Color.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.colorBlue = exports.colorGreen = exports.colorRed = exports.colorBlack = exports.colorWhite = void 0;
exports.colorWhite = [1, 1, 1, 1];
exports.colorBlack = [1, 1, 1, 1];
exports.colorRed = [1, 0, 0, 1];
exports.colorGreen = [0, 1, 0, 1];
exports.colorBlue = [0, 0, 1, 1];
//# sourceMappingURL=Color.js.map

/***/ }),

/***/ "../renderer/lib/components/Animation.js":
/*!***********************************************!*\
  !*** ../renderer/lib/components/Animation.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(animationSpeedInSeconds) {
        if (animationSpeedInSeconds === void 0) { animationSpeedInSeconds = 0; }
        var _this = _super.call(this) || this;
        _this.currentFrame = 0;
        _this.time = 0;
        _this.currentFrame = 0;
        _this.time = 0;
        _this.currentAnimation = null;
        _this.previousAnimation = null;
        _this.animations = new Map();
        _this.animationSpeed = animationSpeedInSeconds;
        _this.finished = true;
        return _this;
    }
    Animation.prototype.running = function (name) {
        return this.currentAnimation === name;
    };
    Animation.prototype.add = function (name, start, end, params) {
        var _a, _b, _c;
        this.animations.set(name, {
            end: end,
            loop: (_a = params === null || params === void 0 ? void 0 : params.loop) !== null && _a !== void 0 ? _a : true,
            speed: (_b = params === null || params === void 0 ? void 0 : params.speed) !== null && _b !== void 0 ? _b : 0,
            start: start,
            fallBack: (_c = params === null || params === void 0 ? void 0 : params.fallBack) !== null && _c !== void 0 ? _c : null,
        });
        if (!this.currentAnimation) {
            this.run(name);
        }
        return this;
    };
    Animation.prototype.run = function (name, reset) {
        var _a;
        if (reset === void 0) { reset = false; }
        if (!(reset || this.currentAnimation !== name)) {
            return this;
        }
        if (!this.animations.has(name)) {
            return this;
        }
        this.time = 0;
        this.finished = false;
        if (this.currentAnimation !== name) {
            this.previousAnimation = this.currentAnimation;
        }
        this.currentAnimation = name;
        this.currentFrame = (_a = this.animations.get(name)) === null || _a === void 0 ? void 0 : _a.start;
        return this;
    };
    return Animation;
}(core_1.Component));
exports["default"] = Animation;
//# sourceMappingURL=Animation.js.map

/***/ }),

/***/ "../renderer/lib/components/FillRect.js":
/*!**********************************************!*\
  !*** ../renderer/lib/components/FillRect.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Color_1 = __webpack_require__(/*! ../color/Color */ "../renderer/lib/color/Color.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var FillRect = (function (_super) {
    __extends(FillRect, _super);
    function FillRect(options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this) || this;
        _this.offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : math_1.Vec2.zero();
        _this.color = (_b = options === null || options === void 0 ? void 0 : options.color) !== null && _b !== void 0 ? _b : Color_1.colorWhite;
        _this.size = options === null || options === void 0 ? void 0 : options.size;
        return _this;
    }
    return FillRect;
}(core_1.Component));
exports["default"] = FillRect;
//# sourceMappingURL=FillRect.js.map

/***/ }),

/***/ "../renderer/lib/components/ParticleEmitter.js":
/*!*****************************************************!*\
  !*** ../renderer/lib/components/ParticleEmitter.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimingFunction = void 0;
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Color_1 = __webpack_require__(/*! ../color/Color */ "../renderer/lib/color/Color.js");
var TimingFunction;
(function (TimingFunction) {
    TimingFunction[TimingFunction["LINEAR"] = 0] = "LINEAR";
    TimingFunction[TimingFunction["EASE"] = 1] = "EASE";
    TimingFunction[TimingFunction["EASE_IN"] = 2] = "EASE_IN";
    TimingFunction[TimingFunction["EASE_IN_OUT"] = 3] = "EASE_IN_OUT";
    TimingFunction[TimingFunction["EASE_OUT"] = 4] = "EASE_OUT";
    TimingFunction[TimingFunction["SMOOTH_IN"] = 5] = "SMOOTH_IN";
    TimingFunction[TimingFunction["SMOOTH_OUT"] = 6] = "SMOOTH_OUT";
    TimingFunction[TimingFunction["SMOOTH_IN_OUT"] = 7] = "SMOOTH_IN_OUT";
})(TimingFunction = exports.TimingFunction || (exports.TimingFunction = {}));
var timingFunctionMapping = (_a = {},
    _a[TimingFunction.LINEAR] = [0, 0, 1, 1],
    _a[TimingFunction.EASE] = [0.25, 0.1, 0.25, 1.0],
    _a[TimingFunction.EASE_IN] = [0.42, 0.0, 1.0, 1.0],
    _a[TimingFunction.EASE_IN_OUT] = [0.42, 0.0, 0.58, 1.0],
    _a[TimingFunction.EASE_OUT] = [0.0, 0.0, 0.58, 1.0],
    _a[TimingFunction.SMOOTH_IN] = [0.2, 1, 0, 1],
    _a[TimingFunction.SMOOTH_OUT] = [1, 0, 0.8, 0],
    _a[TimingFunction.SMOOTH_IN_OUT] = [0.2, 1, 0.8, 0],
    _a);
var getTimingValues = function (timing) {
    if (!timing) {
        return timingFunctionMapping[TimingFunction.LINEAR];
    }
    if (Array.isArray(timing)) {
        return timing;
    }
    return timingFunctionMapping[timing];
};
function minMaxVec2(value, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    }
    if (typeof value === 'number') {
        return math_1.Vec2.create(value, value);
    }
    if (value.min > value.max) {
        throw new Error("Min cannot be greater than Max. min: ".concat(value.min, ", max: ").concat(value.max));
    }
    return math_1.Vec2.create(value.min, value.max);
}
function minMaxSize(value, defaultValue) {
    if (!value) {
        return { max: defaultValue, min: defaultValue };
    }
    if (value instanceof math_1.Vec2) {
        return { max: value, min: value };
    }
    return value;
}
function generateOriginFunction(origin, defaultValue) {
    if (!origin) {
        return function () { return defaultValue; };
    }
    return typeof origin === 'function' ? origin : function () { return origin; };
}
var ParticleEmitter = (function (_super) {
    __extends(ParticleEmitter, _super);
    function ParticleEmitter(maxParticleNumber, params) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        _this = _super.call(this) || this;
        _this.particleNumber = 0;
        _this.age = 0;
        _this.buffers = new Map();
        _this.textureOriginFunction = generateOriginFunction(params === null || params === void 0 ? void 0 : params.textureOrigin, math_1.Vec2.zero());
        _this.textureSizeFunction = generateOriginFunction(params === null || params === void 0 ? void 0 : params.textureSize, math_1.Vec2.create(1, 1));
        _this.maxParticleNumber = maxParticleNumber;
        _this.minMaxLifeTime = minMaxVec2(params === null || params === void 0 ? void 0 : params.lifeTime, math_1.Vec2.create(1, 1));
        _this.minMaxTheta = minMaxVec2(params === null || params === void 0 ? void 0 : params.theta, math_1.Vec2.create(-Math.PI, Math.PI));
        _this.minMaxSpeed = minMaxVec2(params === null || params === void 0 ? void 0 : params.speed, math_1.Vec2.create(100, 100));
        _this.minMaxRotation = minMaxVec2(params === null || params === void 0 ? void 0 : params.rotation, math_1.Vec2.create(0, 0));
        _this.minMaxTorque = minMaxVec2(params === null || params === void 0 ? void 0 : params.torque, math_1.Vec2.create(0, 0));
        _this.frequency = (_a = params === null || params === void 0 ? void 0 : params.frequency) !== null && _a !== void 0 ? _a : 1;
        _this.offset = (_b = params === null || params === void 0 ? void 0 : params.offset) !== null && _b !== void 0 ? _b : math_1.Vec2.zero();
        _this.gravity = (_c = params === null || params === void 0 ? void 0 : params.gravity) !== null && _c !== void 0 ? _c : math_1.Vec2.zero();
        var minMaxSized = minMaxSize(params === null || params === void 0 ? void 0 : params.size, math_1.Vec2.create(10, 10));
        _this.minMaxSize = [
            minMaxSized.min.x,
            minMaxSized.min.y,
            minMaxSized.max.x,
            minMaxSized.max.y,
        ];
        _this.startColor =
            (_f = (_e = (_d = params === null || params === void 0 ? void 0 : params.color) === null || _d === void 0 ? void 0 : _d.start) !== null && _e !== void 0 ? _e : params === null || params === void 0 ? void 0 : params.color) !== null && _f !== void 0 ? _f : Color_1.colorWhite;
        _this.endColor =
            (_j = (_h = (_g = params === null || params === void 0 ? void 0 : params.color) === null || _g === void 0 ? void 0 : _g.end) !== null && _h !== void 0 ? _h : params === null || params === void 0 ? void 0 : params.color) !== null && _j !== void 0 ? _j : Color_1.colorWhite;
        _this.texture = params === null || params === void 0 ? void 0 : params.texture;
        _this.respawn = (_k = params === null || params === void 0 ? void 0 : params.respawn) !== null && _k !== void 0 ? _k : false;
        _this.deleteOnEndOfLife = (_l = params === null || params === void 0 ? void 0 : params.deleteOnEndOfLife) !== null && _l !== void 0 ? _l : false;
        _this.onEndOfLife = params === null || params === void 0 ? void 0 : params.onEndOfLife;
        _this.colorTimingBezier = getTimingValues((_m = params === null || params === void 0 ? void 0 : params.color) === null || _m === void 0 ? void 0 : _m.timing);
        _this.sizeTimingBezier = getTimingValues((_o = params === null || params === void 0 ? void 0 : params.size) === null || _o === void 0 ? void 0 : _o.timing);
        return _this;
    }
    return ParticleEmitter;
}(core_1.Component));
exports["default"] = ParticleEmitter;
//# sourceMappingURL=ParticleEmitter.js.map

/***/ }),

/***/ "../renderer/lib/components/Renderable.js":
/*!************************************************!*\
  !*** ../renderer/lib/components/Renderable.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Renderable = (function (_super) {
    __extends(Renderable, _super);
    function Renderable(params) {
        var _this = this;
        var _a, _b, _c;
        _this = _super.call(this) || this;
        _this.visible = true;
        _this.static = false;
        _this.layer = 0;
        _this.shapes = [];
        _this.quadTree = null;
        _this.visible = (_a = params === null || params === void 0 ? void 0 : params.visible) !== null && _a !== void 0 ? _a : true;
        _this.static = (_b = params === null || params === void 0 ? void 0 : params.static) !== null && _b !== void 0 ? _b : false;
        _this.layer = (_c = params === null || params === void 0 ? void 0 : params.layer) !== null && _c !== void 0 ? _c : 0;
        if (_this.layer < 0 || _this.layer > 256) {
            throw new Error('Sprite layer must be between 0 and 256');
        }
        return _this;
    }
    return Renderable;
}(core_1.Component));
exports["default"] = Renderable;
//# sourceMappingURL=Renderable.js.map

/***/ }),

/***/ "../renderer/lib/components/RenderedCircle.js":
/*!****************************************************!*\
  !*** ../renderer/lib/components/RenderedCircle.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Color_1 = __webpack_require__(/*! ../color/Color */ "../renderer/lib/color/Color.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var RenderedCircle = (function (_super) {
    __extends(RenderedCircle, _super);
    function RenderedCircle(options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        _this = _super.call(this) || this;
        _this.offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : math_1.Vec2.zero();
        _this.color = (_b = options === null || options === void 0 ? void 0 : options.color) !== null && _b !== void 0 ? _b : Color_1.colorWhite;
        _this.fill = (_c = options === null || options === void 0 ? void 0 : options.fill) !== null && _c !== void 0 ? _c : false;
        _this.diagonal = (_d = options === null || options === void 0 ? void 0 : options.diagonal) !== null && _d !== void 0 ? _d : false;
        _this.radius = options === null || options === void 0 ? void 0 : options.radius;
        _this.width = (_e = options === null || options === void 0 ? void 0 : options.width) !== null && _e !== void 0 ? _e : 1;
        return _this;
    }
    return RenderedCircle;
}(core_1.Component));
exports["default"] = RenderedCircle;
//# sourceMappingURL=RenderedCircle.js.map

/***/ }),

/***/ "../renderer/lib/components/RenderedText.js":
/*!**************************************************!*\
  !*** ../renderer/lib/components/RenderedText.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var RenderedText = (function (_super) {
    __extends(RenderedText, _super);
    function RenderedText(str, options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this) || this;
        _this.str = str;
        _this.offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : math_1.Vec2.zero();
        _this.color = (_b = options === null || options === void 0 ? void 0 : options.color) !== null && _b !== void 0 ? _b : [0, 0, 1, 1];
        _this.font = options === null || options === void 0 ? void 0 : options.font;
        return _this;
    }
    return RenderedText;
}(core_1.Component));
exports["default"] = RenderedText;
//# sourceMappingURL=RenderedText.js.map

/***/ }),

/***/ "../renderer/lib/components/Sprite.js":
/*!********************************************!*\
  !*** ../renderer/lib/components/Sprite.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(texture, options) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _this = _super.call(this) || this;
        _this.texture = texture;
        _this.visible = true;
        _this.anchor = (_a = options === null || options === void 0 ? void 0 : options.anchor) !== null && _a !== void 0 ? _a : new math_1.Vec2(0.5, 0.5);
        _this.tint = (_b = options === null || options === void 0 ? void 0 : options.tint) !== null && _b !== void 0 ? _b : 0xffffff;
        _this.alpha = (_c = options === null || options === void 0 ? void 0 : options.alpha) !== null && _c !== void 0 ? _c : 1;
        _this.origin = (_d = options === null || options === void 0 ? void 0 : options.origin) !== null && _d !== void 0 ? _d : new math_1.Vec2(0, 0);
        _this.parallax = (_e = options === null || options === void 0 ? void 0 : options.parallax) !== null && _e !== void 0 ? _e : new math_1.Vec2(1, 1);
        _this.offset = (_f = options === null || options === void 0 ? void 0 : options.offset) !== null && _f !== void 0 ? _f : new math_1.Vec2(0, 0);
        _this.size = (_g = options === null || options === void 0 ? void 0 : options.size) !== null && _g !== void 0 ? _g : new math_1.Vec2(1, 1);
        _this.scale = (_h = options === null || options === void 0 ? void 0 : options.scale) !== null && _h !== void 0 ? _h : new math_1.Vec2(1, 1);
        return _this;
    }
    return Sprite;
}(core_1.Component));
exports["default"] = Sprite;
//# sourceMappingURL=Sprite.js.map

/***/ }),

/***/ "../renderer/lib/lerpCamera.js":
/*!*************************************!*\
  !*** ../renderer/lib/lerpCamera.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var lerpCamera = function (lerpAmout) {
    if (lerpAmout === void 0) { lerpAmout = 0.05; }
    return function (target, currentPosition, elapsedTimeInSeconds, camera) {
        currentPosition.x = (0, math_1.lerp)(currentPosition.x, target.x, lerpAmout * camera.scale);
        currentPosition.y = (0, math_1.lerp)(currentPosition.y, target.y, lerpAmout * camera.scale);
        return currentPosition;
    };
};
exports["default"] = lerpCamera;
//# sourceMappingURL=lerpCamera.js.map

/***/ }),

/***/ "../renderer/lib/managers/TextureManager.js":
/*!**************************************************!*\
  !*** ../renderer/lib/managers/TextureManager.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadTexture = void 0;
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Texture_1 = __webpack_require__(/*! ../objects/Texture */ "../renderer/lib/objects/Texture.js");
var Renderer_1 = __webpack_require__(/*! ../systems/Renderer */ "../renderer/lib/systems/Renderer.js");
function loadTexture(name, path, gl, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, new Promise(function (resolve, reject) {
                        var img = new Image();
                        img.onload = function () {
                            var _a;
                            var texture = new Texture_1.default(img, gl);
                            if ((_a = options === null || options === void 0 ? void 0 : options.log) !== null && _a !== void 0 ? _a : true) {
                                (0, core_1.log)("Loaded %ctexture%c \"".concat(name, "\""), 'tomato');
                            }
                            resolve(texture);
                        };
                        img.onerror = function (err) { return reject(err); };
                        img.src = path;
                    })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
exports.loadTexture = loadTexture;
var TextureManager = (function (_super) {
    __extends(TextureManager, _super);
    function TextureManager(images) {
        if (images === void 0) { images = []; }
        var _this = _super.call(this, 'TextureManager') || this;
        _this.loadingName = 'Textures';
        _this.imagesToLoad = new Map();
        _this.textures = new Map();
        images.forEach(function (_a) {
            var name = _a[0], path = _a[1];
            return _this.add(name, path);
        });
        return _this;
    }
    TextureManager.prototype.loadTexture = function (name, path, gl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, loadTexture(name, path, gl).then(function (texture) {
                            _this.imagesToLoad.delete(name);
                            _this.textures.set(name, texture);
                            return texture;
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    TextureManager.prototype.createLoadingState = function (textureNumber) {
        if (!this.ecs.managers.has(core_1.LoadingStateManager)) {
            return;
        }
        this.ecs.manager(core_1.LoadingStateManager).createState({
            detail: 'Textures',
            name: this.loadingName,
            total: textureNumber,
        });
    };
    TextureManager.prototype.setLoadingState = function (current) {
        if (!this.ecs.managers.has(core_1.LoadingStateManager)) {
            return;
        }
        var state = this.ecs
            .manager(core_1.LoadingStateManager)
            .getState(this.loadingName);
        if (!state) {
            return;
        }
        state.current = current;
    };
    TextureManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, toLoad, renderer, gl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        toLoad = Array.from(this.imagesToLoad);
                        renderer = this.ecs.system(Renderer_1.default);
                        gl = renderer.gl;
                        if (!gl) {
                            throw new Error('webgl context should have been initialized');
                        }
                        this.createLoadingState(toLoad.length);
                        return [4, Promise.all(toLoad.map(function (_a) {
                                var name = _a[0], path = _a[1];
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4, this.loadTexture(name, path, gl).then(function () {
                                                    _this.setLoadingState(++i);
                                                })];
                                            case 1: return [2, _b.sent()];
                                        }
                                    });
                                });
                            })).then(function () {
                                _this.setLoadingState(toLoad.length);
                            })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    TextureManager.prototype.add = function (name, path) {
        this.imagesToLoad.set(name, path);
    };
    TextureManager.prototype.has = function (name) {
        return this.textures.has(name);
    };
    TextureManager.prototype.get = function (name) {
        var texture = this.textures.get(name);
        if (!texture) {
            throw new Error("Texture \"".concat(name, "\" not registered"));
        }
        return texture;
    };
    return TextureManager;
}(core_1.Manager));
exports["default"] = TextureManager;
//# sourceMappingURL=TextureManager.js.map

/***/ }),

/***/ "../renderer/lib/objects/Camera.js":
/*!*****************************************!*\
  !*** ../renderer/lib/objects/Camera.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var depth = 1e5;
var Camera = (function () {
    function Camera(size) {
        this.at = math_1.Vec2.zero();
        this.to = math_1.Vec2.zero();
        this._target = math_1.Vec2.zero();
        this.angle = 0;
        this._scale = 1;
        this._dirty = true;
        this.size = size !== null && size !== void 0 ? size : new math_1.Vec2(1024, 512);
    }
    Camera.prototype.update = function (elapsedTimeInSeconds) {
        var _a;
        if ((_a = this._targetEntity) === null || _a === void 0 ? void 0 : _a.has(core_1.Transform)) {
            this.target(this._targetEntity.get(core_1.Transform).position);
        }
        if (this.targetFunction) {
            this.to = this.targetFunction(this._target, this.to, elapsedTimeInSeconds, this);
        }
    };
    Camera.prototype.getSize = function () {
        return this.size;
    };
    Camera.prototype.getPosition = function () {
        return this.to;
    };
    Camera.prototype.setTargetFunction = function (fn) {
        this.targetFunction = fn;
        return this;
    };
    Camera.prototype.targetEntity = function (entity) {
        this._targetEntity = entity;
        return this;
    };
    Camera.prototype.getTargetEntity = function () {
        return this._targetEntity;
    };
    Camera.prototype.move = function (offset, relatifToZoom) {
        if (relatifToZoom === void 0) { relatifToZoom = false; }
        this.to.x += offset.x / (relatifToZoom ? this._scale : 1);
        this.to.y += offset.y / (relatifToZoom ? this._scale : 1);
        this._target = this.to;
        this._dirty = true;
    };
    Camera.prototype.lookat = function (position) {
        this.to = position;
        this._target = position;
        this._dirty = true;
    };
    Camera.prototype.target = function (position) {
        this._target = position;
    };
    Camera.prototype.zoom = function (value) {
        this.scale += value;
    };
    Object.defineProperty(Camera.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = Math.min(Math.max(0.1, value), 10);
            this._dirty = true;
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.screenToWorld = function (screenPosition) {
        var rotated = math_1.Vec2.rotate(math_1.Vec2.divide(math_1.Vec2.sub(screenPosition, math_1.Vec2.times(this.size, 0.5)), this._scale), this.angle);
        return math_1.Vec2.add(rotated, this.to);
    };
    Camera.prototype.worldToScreen = function (worldPosition) {
        var translated = math_1.Vec2.sub(worldPosition, this.to);
        var rotated = math_1.Vec2.rotate(translated, -this.angle);
        return math_1.Vec2.add(math_1.Vec2.times(rotated, this._scale), math_1.Vec2.times(this.size, 0.5));
    };
    Object.defineProperty(Camera.prototype, "projection", {
        get: function () {
            if (!this._dirty && this._projection) {
                return this._projection;
            }
            var x = this.at.x - this.size.x * 0.5 + this.to.x;
            var y = this.at.y - this.size.y * 0.5 + this.to.y;
            var c = Math.cos(this.angle);
            var s = Math.sin(this.angle);
            var w = 2 / this.size.x;
            var h = -2 / this.size.y;
            var calculatedProjection = [
                c * w,
                s * h,
                0,
                0,
                -s * w,
                c * h,
                0,
                0,
                0,
                0,
                -1 / depth,
                0,
                (this.at.x * (1 - c) + this.at.y * s) * w - (2 * x) / this.size.x - 1,
                (this.at.y * (1 - c) - this.at.x * s) * h + (2 * y) / this.size.y + 1,
                0,
                1 / this.scale,
            ];
            this._projection = calculatedProjection;
            return calculatedProjection;
        },
        enumerable: false,
        configurable: true
    });
    return Camera;
}());
exports["default"] = Camera;
//# sourceMappingURL=Camera.js.map

/***/ }),

/***/ "../renderer/lib/objects/Font.js":
/*!***************************************!*\
  !*** ../renderer/lib/objects/Font.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Font = (function () {
    function Font(texture, options) {
        var _this = this;
        var _a, _b, _c, _d;
        this.letterHeight = (_a = options === null || options === void 0 ? void 0 : options.letterHeight) !== null && _a !== void 0 ? _a : 8;
        this.spaceWidth = (_b = options === null || options === void 0 ? void 0 : options.spaceWidth) !== null && _b !== void 0 ? _b : 8;
        this.spacing = (_c = options === null || options === void 0 ? void 0 : options.spacing) !== null && _c !== void 0 ? _c : -1;
        this.scale = (_d = options === null || options === void 0 ? void 0 : options.scale) !== null && _d !== void 0 ? _d : 1;
        this.texture = texture;
        this.glyphInfos = new Map();
        if (options === null || options === void 0 ? void 0 : options.glyphs) {
            Object.entries(options.glyphs).forEach(function (_a) {
                var key = _a[0], glyph = _a[1];
                _this.glyphInfos.set(key, glyph);
            });
        }
    }
    Font.prototype.getGlyph = function (char) {
        return this.glyphInfos.get(char);
    };
    return Font;
}());
exports["default"] = Font;
//# sourceMappingURL=Font.js.map

/***/ }),

/***/ "../renderer/lib/objects/Texture.js":
/*!******************************************!*\
  !*** ../renderer/lib/objects/Texture.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Texture = (function () {
    function Texture(source, gl, alphaTest, smooth) {
        if (alphaTest === void 0) { alphaTest = 0; }
        if (smooth === void 0) { smooth = true; }
        this.glTexture = 0;
        this.source = source;
        this.alphaTest = alphaTest;
        this.smooth = smooth;
        this.size = math_1.Vec2.zero();
        var glTexture = gl.createTexture();
        if (!glTexture) {
            throw new Error('Could not create gl texture');
        }
        this.glTexture = glTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        if (source instanceof HTMLImageElement) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.source.width, this.source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.source);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.source);
        }
        this.size.x = this.source.width;
        this.size.y = this.source.height;
    }
    Object.defineProperty(Texture.prototype, "webGLTexture", {
        get: function () {
            return this.glTexture;
        },
        enumerable: false,
        configurable: true
    });
    return Texture;
}());
exports["default"] = Texture;
//# sourceMappingURL=Texture.js.map

/***/ }),

/***/ "../renderer/lib/quadTree/QuadTree.js":
/*!********************************************!*\
  !*** ../renderer/lib/quadTree/QuadTree.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var QuadPlace;
(function (QuadPlace) {
    QuadPlace[QuadPlace["TOP_LEFT"] = 0] = "TOP_LEFT";
    QuadPlace[QuadPlace["TOP_RIGHT"] = 1] = "TOP_RIGHT";
    QuadPlace[QuadPlace["BOTTOM_LEFT"] = 2] = "BOTTOM_LEFT";
    QuadPlace[QuadPlace["BOTTOM_RIGHT"] = 3] = "BOTTOM_RIGHT";
})(QuadPlace || (QuadPlace = {}));
var MAX_DEPTH = 8;
var QuadTree = (function () {
    function QuadTree(rect, parent) {
        this.items = new Map();
        this.leaves = [];
        this.leaveRects = [];
        this.depth = parent ? parent.depth + 1 : 0;
        this.parent = parent;
        this.resize(rect);
    }
    Object.defineProperty(QuadTree.prototype, "length", {
        get: function () {
            return this.leaves.reduce(function (acc, curr) { return acc + curr.length; }, this.items.size);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QuadTree.prototype, "itemLength", {
        get: function () {
            return this.items.size;
        },
        enumerable: false,
        configurable: true
    });
    QuadTree.prototype.insert = function (entity) {
        for (var i = 0; i < 4; i++) {
            if (this.depth + 1 < MAX_DEPTH &&
                (0, math_1.contains)(this.leaveRects[i], entity.get(core_1.Transform))) {
                if (!this.leaves[i]) {
                    this.leaves[i] = new QuadTree(this.leaveRects[i], this);
                }
                return this.leaves[i].insert(entity);
            }
        }
        this.items.set(entity._id, entity);
        return this;
    };
    QuadTree.prototype.search = function (rArea, cb) {
        var result = [];
        this.items.forEach(function (entity) {
            if ((0, math_1.overlaps)(rArea, entity.get(core_1.Transform))) {
                cb === null || cb === void 0 ? void 0 : cb(entity);
                result.push(entity);
            }
        });
        for (var i = 0; i < 4; i++) {
            if (!this.leaves[i]) {
                continue;
            }
            if ((0, math_1.contains)(rArea, this.leaveRects[i])) {
                var items = this.leaves[i].getAllItems();
                result.push.apply(result, items);
                if (cb) {
                    items.forEach(function (entity) {
                        cb === null || cb === void 0 ? void 0 : cb(entity);
                    });
                }
            }
            else if ((0, math_1.overlaps)(this.leaveRects[i], rArea)) {
                result.push.apply(result, this.leaves[i].search(rArea, cb));
            }
        }
        return result;
    };
    QuadTree.prototype.remove = function (entity) {
        return this.items.delete(entity._id);
    };
    QuadTree.prototype.getAllItems = function () {
        return this.leaves.reduce(function (acc, curr) {
            return __spreadArray(__spreadArray([], acc, true), curr.getAllItems(), true);
        }, Array.from(this.items.values()));
    };
    QuadTree.prototype.resize = function (rect) {
        this.clear();
        var position = rect.position, size = rect.size;
        this.rect = rect;
        var childSize = size.divide(2);
        var quarter = size.divide(4);
        this.leaveRects[QuadPlace.TOP_LEFT] = {
            position: math_1.Vec2.sub(position, quarter),
            size: childSize,
        };
        this.leaveRects[QuadPlace.TOP_RIGHT] = {
            position: math_1.Vec2.add(position, math_1.Vec2.create(quarter.x, -quarter.y)),
            size: childSize,
        };
        this.leaveRects[QuadPlace.BOTTOM_LEFT] = {
            position: math_1.Vec2.sub(position, math_1.Vec2.create(quarter.x, -quarter.y)),
            size: childSize,
        };
        this.leaveRects[QuadPlace.BOTTOM_RIGHT] = {
            position: math_1.Vec2.add(position, quarter),
            size: childSize,
        };
    };
    QuadTree.prototype.clear = function () {
        var _a;
        this.items.clear();
        while (this.leaves.length > 0) {
            (_a = this.leaves.shift()) === null || _a === void 0 ? void 0 : _a.clear();
        }
    };
    return QuadTree;
}());
exports["default"] = QuadTree;
//# sourceMappingURL=QuadTree.js.map

/***/ }),

/***/ "../renderer/lib/quadTree/QuadTreeList.js":
/*!************************************************!*\
  !*** ../renderer/lib/quadTree/QuadTreeList.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var QuadTree_1 = __webpack_require__(/*! ./QuadTree */ "../renderer/lib/quadTree/QuadTree.js");
var Renderable_1 = __webpack_require__(/*! ../components/Renderable */ "../renderer/lib/components/Renderable.js");
var QuadTreeList = (function (_super) {
    __extends(QuadTreeList, _super);
    function QuadTreeList(signature, options) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, signature, options) || this;
        _this.rendered = 0;
        _this._data = [];
        _this.resize({
            position: (_a = options === null || options === void 0 ? void 0 : options.position) !== null && _a !== void 0 ? _a : math_1.Vec2.zero(),
            size: (_b = options === null || options === void 0 ? void 0 : options.size) !== null && _b !== void 0 ? _b : math_1.Vec2.create(5000, 5000),
        });
        return _this;
    }
    QuadTreeList.prototype.resize = function (rect) {
        var _this = this;
        this.quadTree = new QuadTree_1.default(rect);
        this._data.forEach(function (layerData) {
            return layerData.forEach(function (entity) { return _this.quadTree.insert(entity); });
        });
    };
    QuadTreeList.prototype.__add = function (entity) {
        var layer = entity.get(Renderable_1.default).layer;
        if (!this._data[layer]) {
            this._data[layer] = new Map();
        }
        this._data[layer].set(entity._id, entity);
        entity.get(Renderable_1.default).quadTree = this.quadTree.insert(entity);
    };
    QuadTreeList.prototype.__remove = function (entity) {
        var layer = entity.get(Renderable_1.default).layer;
        this._data[layer].delete(entity._id);
        var renderable = entity.get(Renderable_1.default);
        if (!renderable.quadTree) {
            return;
        }
        var removed = renderable.quadTree.remove(entity);
        if (removed) {
            entity.get(Renderable_1.default).quadTree = null;
        }
    };
    QuadTreeList.prototype.clear = function () {
        this._data = [];
    };
    QuadTreeList.prototype.update = function (entity) {
        this.__remove(entity);
        this.__add(entity);
    };
    QuadTreeList.prototype.forEach = function (callback) {
        this._data.forEach(function (layer) { return layer.forEach(callback); });
    };
    QuadTreeList.prototype.naiveSearchForeach = function (rect, callback) {
        var cb = function (entity) {
            if ((0, math_1.overlaps)(rect, entity.get(core_1.Transform))) {
                callback(entity);
            }
        };
        this.forEach(cb);
    };
    QuadTreeList.prototype.searchForEach = function (rect, callback) {
        var entitiesByLayer = [];
        var entities = this.quadTree.search(rect, function (entity) {
            var layer = entity.get(Renderable_1.default).layer;
            if (!entitiesByLayer[layer]) {
                entitiesByLayer[layer] = [];
            }
            entitiesByLayer[layer].push(entity);
        });
        this.rendered = entities.length;
        entitiesByLayer.forEach(function (layer) { return layer.forEach(callback); });
    };
    Object.defineProperty(QuadTreeList.prototype, "length", {
        get: function () {
            return this._data.reduce(function (acc, curr) { return acc + curr.size; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    return QuadTreeList;
}(core_1.List));
exports["default"] = QuadTreeList;
//# sourceMappingURL=QuadTreeList.js.map

/***/ }),

/***/ "../renderer/lib/renderer.js":
/*!***********************************!*\
  !*** ../renderer/lib/renderer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.colorBlue = exports.colorGreen = exports.colorRed = exports.colorBlack = exports.colorWhite = exports.TimingFunction = exports.ParticleEmitter = exports.Camera = exports.lerpCamera = exports.Animation = exports.Sprite = exports.RenderedText = exports.FillRect = exports.Renderable = exports.QuadTreeList = exports.QuadTree = exports.Texture = exports.TextureManager = exports.Animator = exports.Renderer = void 0;
var Renderer_1 = __webpack_require__(/*! ./systems/Renderer */ "../renderer/lib/systems/Renderer.js");
Object.defineProperty(exports, "Renderer", ({ enumerable: true, get: function () { return Renderer_1.default; } }));
var Animator_1 = __webpack_require__(/*! ./systems/Animator */ "../renderer/lib/systems/Animator.js");
Object.defineProperty(exports, "Animator", ({ enumerable: true, get: function () { return Animator_1.default; } }));
var TextureManager_1 = __webpack_require__(/*! ./managers/TextureManager */ "../renderer/lib/managers/TextureManager.js");
Object.defineProperty(exports, "TextureManager", ({ enumerable: true, get: function () { return TextureManager_1.default; } }));
var Texture_1 = __webpack_require__(/*! ./objects/Texture */ "../renderer/lib/objects/Texture.js");
Object.defineProperty(exports, "Texture", ({ enumerable: true, get: function () { return Texture_1.default; } }));
var QuadTree_1 = __webpack_require__(/*! ./quadTree/QuadTree */ "../renderer/lib/quadTree/QuadTree.js");
Object.defineProperty(exports, "QuadTree", ({ enumerable: true, get: function () { return QuadTree_1.default; } }));
var QuadTreeList_1 = __webpack_require__(/*! ./quadTree/QuadTreeList */ "../renderer/lib/quadTree/QuadTreeList.js");
Object.defineProperty(exports, "QuadTreeList", ({ enumerable: true, get: function () { return QuadTreeList_1.default; } }));
var Renderable_1 = __webpack_require__(/*! ./components/Renderable */ "../renderer/lib/components/Renderable.js");
Object.defineProperty(exports, "Renderable", ({ enumerable: true, get: function () { return Renderable_1.default; } }));
var FillRect_1 = __webpack_require__(/*! ./components/FillRect */ "../renderer/lib/components/FillRect.js");
Object.defineProperty(exports, "FillRect", ({ enumerable: true, get: function () { return FillRect_1.default; } }));
var RenderedText_1 = __webpack_require__(/*! ./components/RenderedText */ "../renderer/lib/components/RenderedText.js");
Object.defineProperty(exports, "RenderedText", ({ enumerable: true, get: function () { return RenderedText_1.default; } }));
var Sprite_1 = __webpack_require__(/*! ./components/Sprite */ "../renderer/lib/components/Sprite.js");
Object.defineProperty(exports, "Sprite", ({ enumerable: true, get: function () { return Sprite_1.default; } }));
var Animation_1 = __webpack_require__(/*! ./components/Animation */ "../renderer/lib/components/Animation.js");
Object.defineProperty(exports, "Animation", ({ enumerable: true, get: function () { return Animation_1.default; } }));
var lerpCamera_1 = __webpack_require__(/*! ./lerpCamera */ "../renderer/lib/lerpCamera.js");
Object.defineProperty(exports, "lerpCamera", ({ enumerable: true, get: function () { return lerpCamera_1.default; } }));
var Camera_1 = __webpack_require__(/*! ./objects/Camera */ "../renderer/lib/objects/Camera.js");
Object.defineProperty(exports, "Camera", ({ enumerable: true, get: function () { return Camera_1.default; } }));
var ParticleEmitter_1 = __webpack_require__(/*! ./components/ParticleEmitter */ "../renderer/lib/components/ParticleEmitter.js");
Object.defineProperty(exports, "ParticleEmitter", ({ enumerable: true, get: function () { return ParticleEmitter_1.default; } }));
Object.defineProperty(exports, "TimingFunction", ({ enumerable: true, get: function () { return ParticleEmitter_1.TimingFunction; } }));
var Color_1 = __webpack_require__(/*! ./color/Color */ "../renderer/lib/color/Color.js");
Object.defineProperty(exports, "colorWhite", ({ enumerable: true, get: function () { return Color_1.colorWhite; } }));
Object.defineProperty(exports, "colorBlack", ({ enumerable: true, get: function () { return Color_1.colorBlack; } }));
Object.defineProperty(exports, "colorRed", ({ enumerable: true, get: function () { return Color_1.colorRed; } }));
Object.defineProperty(exports, "colorGreen", ({ enumerable: true, get: function () { return Color_1.colorGreen; } }));
Object.defineProperty(exports, "colorBlue", ({ enumerable: true, get: function () { return Color_1.colorBlue; } }));
//# sourceMappingURL=renderer.js.map

/***/ }),

/***/ "../renderer/lib/systems/Animator.js":
/*!*******************************************!*\
  !*** ../renderer/lib/systems/Animator.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Sprite_1 = __webpack_require__(/*! ../components/Sprite */ "../renderer/lib/components/Sprite.js");
var Animation_1 = __webpack_require__(/*! ../components/Animation */ "../renderer/lib/components/Animation.js");
var Animator = (function (_super) {
    __extends(Animator, _super);
    function Animator() {
        return _super.call(this, 'Animator', [Animation_1.default, Sprite_1.default]) || this;
    }
    Animator.prototype.onEntityUpdate = function (entity, elapsedTimeInSeconds) {
        var animation = entity.get(Animation_1.default);
        if (!animation.animations.has(animation.currentAnimation)) {
            return;
        }
        var currentAnimation = animation.animations.get(animation.currentAnimation);
        if (!currentAnimation) {
            return;
        }
        var sprite = entity.get(Sprite_1.default);
        animation.time += elapsedTimeInSeconds;
        var speed = currentAnimation.speed, start = currentAnimation.start, end = currentAnimation.end, loop = currentAnimation.loop;
        if (animation.time >= (speed || animation.animationSpeed)) {
            animation.time = 0;
            animation.currentFrame++;
            if (animation.currentFrame > end) {
                if (loop) {
                    animation.currentFrame = start;
                }
                else if (currentAnimation.fallBack !== null) {
                    animation.run(currentAnimation.fallBack);
                }
                else {
                    animation.finished = true;
                    animation.currentFrame--;
                }
            }
        }
        sprite.origin.x = (animation.currentFrame * sprite.size.x) % 1;
        sprite.origin.y =
            Math.floor(animation.currentFrame * sprite.size.x) * sprite.size.y;
    };
    return Animator;
}(core_1.System));
exports["default"] = Animator;
//# sourceMappingURL=Animator.js.map

/***/ }),

/***/ "../renderer/lib/systems/Renderer.js":
/*!*******************************************!*\
  !*** ../renderer/lib/systems/Renderer.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Camera_1 = __webpack_require__(/*! ../objects/Camera */ "../renderer/lib/objects/Camera.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var QuadTreeList_1 = __webpack_require__(/*! ../quadTree/QuadTreeList */ "../renderer/lib/quadTree/QuadTreeList.js");
var Color_1 = __webpack_require__(/*! ../color/Color */ "../renderer/lib/color/Color.js");
var FillTriangle_1 = __webpack_require__(/*! ../webgl/shaders/FillTriangle */ "../renderer/lib/webgl/shaders/FillTriangle.js");
var Renderable_1 = __webpack_require__(/*! ../components/Renderable */ "../renderer/lib/components/Renderable.js");
var ParticlesUpdate_1 = __webpack_require__(/*! ../webgl/shaders/ParticlesUpdate */ "../renderer/lib/webgl/shaders/ParticlesUpdate.js");
var ParticlesRender_1 = __webpack_require__(/*! ../webgl/shaders/ParticlesRender */ "../renderer/lib/webgl/shaders/ParticlesRender.js");
var Lines_1 = __webpack_require__(/*! ../webgl/shaders/Lines */ "../renderer/lib/webgl/shaders/Lines.js");
var Sprite_1 = __webpack_require__(/*! ../webgl/shaders/Sprite */ "../renderer/lib/webgl/shaders/Sprite.js");
var FillRect_1 = __webpack_require__(/*! ../webgl/shaders/FillRect */ "../renderer/lib/webgl/shaders/FillRect.js");
var Circle_1 = __webpack_require__(/*! ../webgl/shaders/Circle */ "../renderer/lib/webgl/shaders/Circle.js");
var Text_1 = __webpack_require__(/*! ../webgl/shaders/Text */ "../renderer/lib/webgl/shaders/Text.js");
var defaultParams = {
    alpha: false,
    antialias: false,
    canvasName: 'canvas',
    useTree: false,
};
var Renderer = (function (_super) {
    __extends(Renderer, _super);
    function Renderer(params) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        _this = _super.call(this, 'Renderer', [Renderable_1.default, core_1.Transform], {
            list: QuadTreeList_1.default,
        }) || this;
        _this.toDraw = [];
        _this.isInFrame = false;
        _this.shapes = new Map();
        _this.movedEntities = new Map();
        _this.opts = {
            alpha: (_a = params === null || params === void 0 ? void 0 : params.alpha) !== null && _a !== void 0 ? _a : defaultParams.alpha,
            antialias: (_b = params === null || params === void 0 ? void 0 : params.antialias) !== null && _b !== void 0 ? _b : defaultParams.antialias,
        };
        var canvas = document.getElementById((_c = params === null || params === void 0 ? void 0 : params.canvasName) !== null && _c !== void 0 ? _c : defaultParams.canvasName);
        if (!canvas) {
            throw new Error('Could not find canvas');
        }
        _this.initDefaultShaders = (_d = params === null || params === void 0 ? void 0 : params.initDefaultShaders) !== null && _d !== void 0 ? _d : true;
        _this.canvas = canvas;
        _this.canvas.tabIndex = 1;
        _this.useTree = (_e = params === null || params === void 0 ? void 0 : params.useTree) !== null && _e !== void 0 ? _e : defaultParams.useTree;
        _this.canvas.focus();
        var gl = _this.canvas.getContext('webgl2', _this.opts);
        if (!gl) {
            throw new Error('Could not create GL context');
        }
        _this.gl = gl;
        _this.camera = (_f = params === null || params === void 0 ? void 0 : params.camera) !== null && _f !== void 0 ? _f : new Camera_1.default();
        _this.canvas.width = _this.camera.getSize().x;
        _this.canvas.height = _this.camera.getSize().y;
        _this._shaders = new core_1.ConstructorMap();
        return _this;
    }
    Renderer.prototype.update = function (elapsedTimeInSeconds, totalTimeInSeconds) {
        var _this = this;
        this.clear();
        this.isInFrame = true;
        this.camera.update(elapsedTimeInSeconds);
        this.updateMovedEntities();
        this._shaders.forEach(function (shader) { return shader.preRender(_this.camera); });
        var cb = function (entity) {
            _this.onEntityUpdate(entity, elapsedTimeInSeconds, totalTimeInSeconds);
        };
        var entities = this.entities;
        if (this.useTree) {
            entities.searchForEach(this.fov, cb);
        }
        else {
            entities.naiveSearchForeach(this.fov, cb);
        }
        this.applyDrawingFunctions();
        this._shaders.forEach(function (shader) {
            return shader.postRender(_this.camera, elapsedTimeInSeconds, totalTimeInSeconds);
        });
        this.isInFrame = false;
    };
    Object.defineProperty(Renderer.prototype, "fov", {
        get: function () {
            var position = this.camera.getPosition();
            var size = math_1.Vec2.times(this.camera.getSize(), 1 / this.camera.scale);
            return {
                position: position,
                size: size,
            };
        },
        enumerable: false,
        configurable: true
    });
    Renderer.prototype.setTree = function (rect) {
        this.useTree = true;
        this.entities.resize(rect);
    };
    Renderer.prototype.onEntityUpdate = function (entity, elapsedTimeInSeconds, totalTimeInSeconds) {
        var _this = this;
        var _a = entity.get(Renderable_1.default), shapes = _a.shapes, visible = _a.visible;
        if (!visible) {
            return;
        }
        for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
            var shape = shapes_1[_i];
            var shaders = this.shapes.get(shape);
            if (!shaders) {
                continue;
            }
            shaders.forEach(function (shader) {
                return shader.render(entity, _this.camera, elapsedTimeInSeconds, totalTimeInSeconds);
            });
        }
    };
    Renderer.prototype.onSystemInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initDefaultShaders) {
                            return [2];
                        }
                        return [4, this.addShader(new Sprite_1.default(this.gl))];
                    case 1:
                        _a.sent();
                        return [4, this.addShader(new FillTriangle_1.default(this.gl))];
                    case 2:
                        _a.sent();
                        return [4, this.addShader(new Lines_1.default(this.gl))];
                    case 3:
                        _a.sent();
                        return [4, this.addShader(new FillRect_1.default(this.gl))];
                    case 4:
                        _a.sent();
                        return [4, this.addShader(new Circle_1.default(this.gl))];
                    case 5:
                        _a.sent();
                        return [4, this.addShader(new Text_1.default(this.gl))];
                    case 6:
                        _a.sent();
                        return [4, this.addShader(new ParticlesUpdate_1.default(this.gl))];
                    case 7:
                        _a.sent();
                        return [4, this.addShader(new ParticlesRender_1.default(this.gl))];
                    case 8:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.onEntityCreation = function (entity) {
        var _this = this;
        var renderable = entity.get(Renderable_1.default);
        this.shapes.forEach(function (shapes, key) {
            if (entity.has(key)) {
                shapes.forEach(function (shape) { return shape.onEntityCreation(entity); });
                renderable.shapes.push(key);
            }
        });
        if (renderable.shapes.length < 1) {
            throw new Error('Renderable must have at least one shape');
        }
        if (!renderable.static && this.useTree) {
            var position = entity.get(core_1.Transform).position;
            var cb = function () { return _this.onEntityChange(entity); };
            position.observe(cb);
        }
    };
    Renderer.prototype.onEntityChange = function (entity) {
        var _this = this;
        if (entity.has(Renderable_1.default)) {
            this.movedEntities.set(entity._id, entity);
        }
        entity.children.forEach(function (child) { return _this.onEntityChange(child); });
    };
    Renderer.prototype.updateMovedEntities = function () {
        var entities = this.entities;
        this.movedEntities.forEach(function (entity) {
            entities.update(entity);
        });
        this.movedEntities.clear();
    };
    Renderer.prototype.addShader = function (shader) {
        return __awaiter(this, void 0, void 0, function () {
            var shaders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, shader.init(this)];
                    case 1:
                        _a.sent();
                        if (shader.component) {
                            shaders = this.shapes.get(shader.component);
                            if (shaders) {
                                shaders.push(shader);
                            }
                            else {
                                this.shapes.set(shader.component, [shader]);
                            }
                        }
                        this._shaders.set(shader);
                        return [2];
                }
            });
        });
    };
    Renderer.prototype.getCamera = function () {
        return this.camera;
    };
    Renderer.prototype.onDraw = function (fn) {
        this.toDraw.push(fn);
    };
    Renderer.prototype.clear = function () {
        this.gl.enable(this.gl.BLEND);
        this.gl.viewport(0, 0, this.camera.getSize().x, this.camera.getSize().y);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    Renderer.prototype.assertIsInFrame = function () {
        if (!this.isInFrame) {
            throw new Error('Render call should be in a drawing frame. Maybe you should use onDraw ?');
        }
    };
    Renderer.prototype.fillRect = function (position, size, options) {
        var _a, _b;
        this.assertIsInFrame();
        var shader = this._shaders.get(FillRect_1.default);
        shader === null || shader === void 0 ? void 0 : shader.rect(position, size, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            rotation: (_b = options === null || options === void 0 ? void 0 : options.rotation) !== null && _b !== void 0 ? _b : 0,
        });
    };
    Renderer.prototype.strokeRect = function (position, size, options) {
        var _a, _b, _c, _d;
        this.assertIsInFrame();
        var shader = this._shaders.get(Lines_1.default);
        shader === null || shader === void 0 ? void 0 : shader.rect(position, size, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            diagonal: (_b = options === null || options === void 0 ? void 0 : options.diagonal) !== null && _b !== void 0 ? _b : false,
            rotation: (_c = options === null || options === void 0 ? void 0 : options.rotation) !== null && _c !== void 0 ? _c : 0,
            width: (_d = options === null || options === void 0 ? void 0 : options.width) !== null && _d !== void 0 ? _d : 1,
        });
    };
    Renderer.prototype.fillCircle = function (position, size, options) {
        var _a, _b, _c;
        this.assertIsInFrame();
        var shader = this._shaders.get(Circle_1.default);
        shader === null || shader === void 0 ? void 0 : shader.circle(position, typeof size === 'number' ? math_1.Vec2.create(size, size) : size, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            fill: true,
            rotation: (_b = options === null || options === void 0 ? void 0 : options.rotation) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options === null || options === void 0 ? void 0 : options.width) !== null && _c !== void 0 ? _c : 1,
        });
    };
    Renderer.prototype.strokeCircle = function (position, size, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.assertIsInFrame();
        var shader = this._shaders.get(Circle_1.default);
        var vSize = typeof size === 'number' ? math_1.Vec2.create(size, size) : size;
        shader === null || shader === void 0 ? void 0 : shader.circle(position, vSize, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            fill: false,
            rotation: (_b = options === null || options === void 0 ? void 0 : options.rotation) !== null && _b !== void 0 ? _b : 0,
            width: (_c = options === null || options === void 0 ? void 0 : options.width) !== null && _c !== void 0 ? _c : 1,
        });
        if (options === null || options === void 0 ? void 0 : options.diagonal) {
            this.line(position, position.add(math_1.Vec2.create(Math.cos((_d = options.rotation) !== null && _d !== void 0 ? _d : 0) * vSize.x * 0.5, Math.sin((_e = options.rotation) !== null && _e !== void 0 ? _e : 0) * vSize.x * 0.5)), {
                color: (_f = options === null || options === void 0 ? void 0 : options.color) !== null && _f !== void 0 ? _f : Color_1.colorWhite,
                width: (_g = options === null || options === void 0 ? void 0 : options.width) !== null && _g !== void 0 ? _g : 1,
            });
        }
    };
    Renderer.prototype.lineHeight = function () {
        var _a, _b;
        return (_b = (_a = this._shaders.get(Text_1.default)) === null || _a === void 0 ? void 0 : _a.lineHeight()) !== null && _b !== void 0 ? _b : 0;
    };
    Renderer.prototype.text = function (position, text, params) {
        var _a, _b;
        this.assertIsInFrame();
        var shader = this._shaders.get(Text_1.default);
        shader === null || shader === void 0 ? void 0 : shader.text(position, text, {
            color: (_a = params === null || params === void 0 ? void 0 : params.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            size: (_b = params === null || params === void 0 ? void 0 : params.size) !== null && _b !== void 0 ? _b : 1,
        });
    };
    Renderer.prototype.line = function (positionStart, positionEnd, options) {
        var _a, _b;
        this.assertIsInFrame();
        var shader = this._shaders.get(Lines_1.default);
        shader === null || shader === void 0 ? void 0 : shader.line(positionStart, positionEnd, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            width: (_b = options === null || options === void 0 ? void 0 : options.width) !== null && _b !== void 0 ? _b : 1,
        });
    };
    Renderer.prototype.strokePoly = function (position, points, options) {
        var _a, _b, _c, _d;
        this.assertIsInFrame();
        var shader = this._shaders.get(Lines_1.default);
        shader === null || shader === void 0 ? void 0 : shader.poly(position, points, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            diagonal: (_b = options === null || options === void 0 ? void 0 : options.diagonal) !== null && _b !== void 0 ? _b : false,
            rotation: (_c = options === null || options === void 0 ? void 0 : options.rotation) !== null && _c !== void 0 ? _c : 0,
            width: (_d = options === null || options === void 0 ? void 0 : options.width) !== null && _d !== void 0 ? _d : 1,
        });
    };
    Renderer.prototype.fillPoly = function (position, points, options) {
        var _a, _b;
        this.assertIsInFrame();
        var shader = this._shaders.get(FillTriangle_1.default);
        if (!shader) {
            return;
        }
        shader.fillPoly(position, points, {
            color: (_a = options === null || options === void 0 ? void 0 : options.color) !== null && _a !== void 0 ? _a : Color_1.colorWhite,
            rotation: (_b = options === null || options === void 0 ? void 0 : options.rotation) !== null && _b !== void 0 ? _b : 0,
        });
    };
    Renderer.prototype.applyDrawingFunctions = function () {
        while (this.toDraw.length > 0) {
            var functionToDraw = this.toDraw.shift();
            if (!functionToDraw) {
                return;
            }
            functionToDraw(this);
        }
    };
    return Renderer;
}(core_1.System));
exports["default"] = Renderer;
//# sourceMappingURL=Renderer.js.map

/***/ }),

/***/ "../renderer/lib/webgl/Attribute.js":
/*!******************************************!*\
  !*** ../renderer/lib/webgl/Attribute.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var makeBuffer_1 = __webpack_require__(/*! ./shaders/helpers/makeBuffer */ "../renderer/lib/webgl/shaders/helpers/makeBuffer.js");
var Attribute = (function () {
    function Attribute(gl, program, name, options) {
        var _a, _b, _c, _d;
        this.stride = 0;
        this.vertexAttribDivisor = 0;
        this.isInstance = false;
        this.elemNumber = 0;
        this._size = options.size;
        this.vertexAttribDivisor =
            (_a = options.vertexAttribDivisor) !== null && _a !== void 0 ? _a : this.vertexAttribDivisor;
        this.isInstance = (_b = options.isInstance) !== null && _b !== void 0 ? _b : this.isInstance;
        this.stride = (_c = options.stride) !== null && _c !== void 0 ? _c : this.stride;
        this.location = gl.getAttribLocation(program, name);
        if (this.location < 0) {
            (0, core_1.throwError)("could not get attribute location: ".concat(name));
        }
        this.arrayData = options.data
            ? new Float32Array(options.data)
            : new Float32Array(options.maxElements * options.size);
        this.buffer = (0, makeBuffer_1.default)(gl, this.arrayData, (_d = options.usage) !== null && _d !== void 0 ? _d : gl.DYNAMIC_DRAW);
    }
    Attribute.prototype.pushSingleData = function (data) {
        if (this.size !== 1) {
            throw new Error('Only size 1 can not to be an array');
        }
        this.arrayData[this._size * this.elemNumber] = data;
    };
    Object.defineProperty(Attribute.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Attribute.prototype.pushMultiData = function (data) {
        if (data.length !== this.size) {
            throw new Error('bad size');
        }
        for (var i = 0; i < this.size; i++) {
            this.arrayData[this.size * this.elemNumber + i] = data[i];
        }
    };
    Attribute.prototype.pushData = function (data) {
        if (Array.isArray(data)) {
            this.pushMultiData(data);
        }
        else {
            this.pushSingleData(data);
        }
        this.elemNumber++;
    };
    Attribute.prototype.pushManyData = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.pushData(data[i]);
        }
    };
    Attribute.prototype.enable = function (gl) {
        if (this.location < 0) {
            return;
        }
        gl.enableVertexAttribArray(this.location);
    };
    Attribute.prototype.bindData = function (gl) {
        if (this.location < 0) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        if (this.isInstance) {
            gl.bufferData(gl.ARRAY_BUFFER, this.arrayData, gl.STATIC_DRAW);
        }
        else {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.arrayData, 0, this.elemNumber * this.size);
        }
        this.elemNumber = 0;
    };
    Attribute.prototype.pointer = function (gl, buffer) {
        if (this.location < 0) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer !== null && buffer !== void 0 ? buffer : this.buffer);
        var type = gl.FLOAT;
        var normalize = false;
        var offset = 0;
        gl.vertexAttribPointer(this.location, this.size, type, normalize, this.stride, offset);
        if (this.vertexAttribDivisor > 0) {
            gl.vertexAttribDivisor(this.location, this.vertexAttribDivisor);
        }
    };
    Attribute.prototype.flush = function (gl) {
        this.enable(gl);
        this.bindData(gl);
        this.pointer(gl);
    };
    return Attribute;
}());
exports["default"] = Attribute;
//# sourceMappingURL=Attribute.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/circle.fs.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/glsl/circle.fs.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\n\nprecision highp float;\nin vec4 v_color;\nin vec2 v_vertex;\nin float v_radius;\nin float v_width;\nin float v_fill;\n\nout vec4 outColor;\n\nfloat sqrtDist(in vec2 p) {\n    return p.x * p.x + p.y * p.y;\n}\n\nvoid main() {\n    float c = sqrtDist(v_vertex);\n    if (v_fill < 1.0 && c < 0.25 - v_width / v_radius) {\n        discard;\n    }\n\n    if (c > 0.25) {\n        discard;\n    }\n\n    outColor = v_color;\n}\n";
//# sourceMappingURL=circle.fs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/circle.vs.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/glsl/circle.vs.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec2 a_vertex;\nin float a_rotation;\nin float a_width;\nin float a_fill;\nin vec2 a_position;\nin vec2 a_size;\nin vec4 a_color;\n\nuniform mat4 matrix_camera;\n\nout vec4 v_color;\nout vec2 v_vertex;\nout float v_radius;\nout float v_width;\nout float v_fill;\n\nvoid main() {\n    mat3 scale = mat3(\n        a_size.x, 0, 0,\n        0, a_size.y, 0,\n        0, 0, 1\n    );\n\n    float c = cos(a_rotation);\n    float s = sin(a_rotation);\n    mat3 rotate = mat3(\n        c, s, 0,\n        -s, c, 0,\n        0, 0, 1\n    );\n\n    mat3 translate = mat3(\n        1, 0, 0,\n        0, 1, 0,\n        a_position.x, a_position.y, 1\n    );\n\n    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(a_vertex.xy, 1), 1.0);\n\n    v_radius = (a_size.x + a_size.y) * 0.5;\n    v_width = a_width;\n    v_fill = a_fill;\n    v_vertex = a_vertex;\n    v_color = a_color;\n}\n";
//# sourceMappingURL=circle.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/color.fs.js":
/*!**********************************************!*\
  !*** ../renderer/lib/webgl/glsl/color.fs.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\n\nprecision highp float;\n\nin vec4 v_color;\n\nout vec4 outColor;\n\nvoid main() {\n    outColor = v_color;\n}\n";
//# sourceMappingURL=color.fs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/line.vs.js":
/*!*********************************************!*\
  !*** ../renderer/lib/webgl/glsl/line.vs.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec3 vertexPos;\nin vec2 inLineStart;\nin vec2 inLineEnd;\nin float inLineWidth;\nin vec4 lineColor;\n\nout vec4 v_color;\n\nuniform mat4 matrix_camera;\nvoid main(void) {\n    v_color = lineColor;\n    vec2 lineStart = inLineStart;\n    vec2 lineEnd = inLineEnd;\n    float lineWidth = inLineWidth;\n    vec2 delta = lineStart - lineEnd;\n    vec2 centerPos = 0.5 * (lineStart + lineEnd);\n    float lineLength = length(delta);\n    float phi = atan(delta.y/delta.x);\n    mat3 scale = mat3(\n    lineLength, 0, 0,\n    0, lineWidth, 0,\n    0, 0, 1);\n    mat3 rotate = mat3(\n    cos(phi), sin(phi), 0,\n    -sin(phi), cos(phi), 0,\n    0, 0, 1);\n    mat3 translate = mat3(\n    1, 0, 0,\n    0, 1, 0,\n    centerPos.x, centerPos.y, 1);\n\n\n    gl_Position = matrix_camera * vec4(translate *  rotate *  scale * vertexPos, 1.0);\n}\n";
//# sourceMappingURL=line.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/particleRender.fs.js":
/*!*******************************************************!*\
  !*** ../renderer/lib/webgl/glsl/particleRender.fs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\nin vec4 v_color;\nin vec2 v_texcoord;\nin vec2 v_texture_origin;\nin vec2 v_texture_size;\n\nuniform sampler2D u_texture;\n\nout vec4 outColor;\n\nvoid main() {\n    vec4 color = texture(u_texture, v_texcoord * v_texture_size + v_texture_origin) * v_color;\n    outColor = color;\n}\n";
//# sourceMappingURL=particleRender.fs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/particleRender.vs.js":
/*!*******************************************************!*\
  !*** ../renderer/lib/webgl/glsl/particleRender.vs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nin vec2 vertex;\nin vec4 position;\nin vec2 ageAndLifetime;\nin vec2 torqueAndRotation;\nin vec2 texcoord;\nin vec2 texture_origin;\nin vec2 texture_size;\n\nuniform mat4 matrix_camera;\nuniform vec4 u_startColor;\nuniform vec4 u_endColor;\nuniform vec4 u_minMaxSize;\n\n// uniform vec4[2] u_bezier;\n\nout vec4 v_color;\nout vec2 v_texcoord;\nout vec2 v_texture_origin;\nout vec2 v_texture_size;\n\n\n/*\nstart bezier\n\nfloat curveAA(float t, float x1, float x2) {\n    float v = 1.0 - t;\n\n    return 3.0 * v * v * t * x1 + 3.0 * v * t * t * x2 + t * t * t;\n}\n\nfloat derivativeCurveX(float t, float x1, float x2) {\n    float v = 1.0 - t;\n\n    return 3.0 * (2.0 * (t - 1.0) * t + v * v) * x1 + 3.0 * (- t * t * t + 2.0 * v * t) * x2;\n}\n\nfloat cubicBezier(float x1, float y1, float x2, float y2, float epsilon, float t) {\n    if (x1 == y1 && x2 == x2) {\n        return t;\n    }\n\n    float x = t, t0, t1, t2, calculatedX2;\n    int i = 0;\n\n    for (t2 = x, i = 0; i < 8; i++){\n        calculatedX2 = curveAA(t2, x1, x2) - x;\n        if (abs(calculatedX2) < epsilon) {\n            return curveAA(t2, y1, y2);\n        }\n        float d2 = derivativeCurveX(t2, x1, x2);\n        if (abs(d2) < 1e-6) {\n            break;\n        }\n        t2 = t2 - calculatedX2 / d2;\n    }\n\n    t0 = 0.0;\n    t1 = 1.0;\n    t2 = x;\n\n    if (t2 < t0) {\n        return curveAA(t0, y1, y2);\n    }\n    if (t2 > t1) {\n        return curveAA(t1, y1, y2);\n    }\n\n\n    // Fallback to the bisection method for reliability.\n    while (t0 < t1){\n        calculatedX2 = curveAA(t2, x1, x2);\n        if (abs(calculatedX2 - x) < epsilon) {\n            return curveAA(t2, y1, y2);\n        }\n        if (x > calculatedX2) {\n            t0 = t2;\n        } else {\n            t1 = t2;\n        }\n        t2 = (t1 - t0) * 0.5 + t0;\n    }\n\n    // Failure\n    return curveAA(t2, y1, y2);\n}\n\nend bezier\n*/\n\nvec4 interpolation(float t, vec4 min, vec4 max) {\n    float invPercentage = 1.0 - t;\n\n    return invPercentage * min + t * max;\n}\n\nvec2 interpolation(float t, vec2 min, vec2 max) {\n    float invPercentage = 1.0 - t;\n\n    return invPercentage * min + t * max;\n}\n\nfloat minMax(float value) {\n    if (value > 1.0) {\n        return 1.0;\n    }\n    if (value < 0.0) {\n        return 0.0;\n    }\n    return value;\n}\n\nvoid main() {\n    float t = minMax(ageAndLifetime.x / ageAndLifetime.y);\n    // vec4 sizeCubic = u_bezier[1];\n    // vec4 colorCubic = u_bezier[0];\n    float sizePercentage = t; // minMax(cubicBezier(sizeCubic[0], sizeCubic[1], sizeCubic[2], sizeCubic[3], 0.01, t));\n    float colorPercentage = t; // minMax(cubicBezier(colorCubic[0], colorCubic[1], colorCubic[2], colorCubic[3], 0.01, t));\n\n    float phi = torqueAndRotation.y;\n\n    vec2 size = interpolation(sizePercentage, u_minMaxSize.xy, u_minMaxSize.zw);\n\n    mat3 scale = mat3(\n        size.x, 0, 0,\n        0, size.y, 0,\n        0, 0, 1\n    );\n\n    mat3 rotate = mat3(\n        cos(phi), sin(phi), 0,\n        -sin(phi), cos(phi), 0,\n        0, 0, 1\n    );\n\n    mat3 translate = mat3(\n        1, 0, 0,\n        0, 1, 0,\n        position.x, position.y, 1\n    );\n\n    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(vertex.xy, 1), 1.0);\n    v_color = interpolation(colorPercentage, u_startColor, u_endColor);\n    v_texcoord = texcoord;\n\n    v_texture_origin = texture_origin;\n    v_texture_size = texture_size;\n}\n";
//# sourceMappingURL=particleRender.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/particleUpdate.fs.js":
/*!*******************************************************!*\
  !*** ../renderer/lib/webgl/glsl/particleUpdate.fs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\nvoid main() {\n}\n";
//# sourceMappingURL=particleUpdate.fs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/particleUpdate.vs.js":
/*!*******************************************************!*\
  !*** ../renderer/lib/webgl/glsl/particleUpdate.vs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec2 position;\nin vec2 velocity;\nin vec2 ageAndLifetime;\nin vec2 torqueAndRotation;\n\nout vec2 out_position;\nout vec2 out_velocity;\nout vec2 out_ageAndLifetime;\nout vec2 out_torqueAndRotation;\n\nuniform sampler2D rgNoise;\nuniform vec2 u_time;\nuniform vec2 u_minMaxLifetime;\nuniform vec2 u_gravity;\nuniform vec2 u_spawnPosition;\nuniform vec2 u_minMaxTheta;\nuniform vec2 u_minMaxSpeed;\nuniform vec2 u_minMaxTorque;\nuniform vec2 u_minMaxRotation;\nuniform float u_respawn;\n\nvoid update(float newAge, float elapsedTimeInSeconds) {\n    out_ageAndLifetime = vec2(newAge, ageAndLifetime.y);\n    out_velocity = velocity + u_gravity * elapsedTimeInSeconds;\n    out_position = position + out_velocity * elapsedTimeInSeconds;\n    out_torqueAndRotation = vec2(torqueAndRotation.x, torqueAndRotation.y + torqueAndRotation.x * elapsedTimeInSeconds);\n}\n\nint randIndex = 0;\n\nvec2 getRand() {\n    int textureSize = 512;\n    int seed = (gl_VertexID + randIndex++) % textureSize;\n\n    int oneDSeed = (gl_VertexID + int(u_time.y) + randIndex++) % (textureSize * textureSize);\n    int y = oneDSeed / textureSize;\n    int x = oneDSeed % textureSize;\n    ivec2 noise_coord = ivec2(x, y);\n\n    return texelFetch(rgNoise, noise_coord, 0).rg;\n}\n\nvoid reset() {\n    vec2 randVelocity = getRand();\n    vec2 randLifetime = getRand();\n    vec2 randTorque = getRand();\n    vec2 randRotation = getRand();\n\n    float theta = u_minMaxTheta.x + randVelocity.r * (u_minMaxTheta.y - u_minMaxTheta.x);\n    float x = cos(theta);\n    float y = sin(theta);\n\n    out_position = u_spawnPosition;\n    out_velocity = vec2(x, y) * (u_minMaxSpeed.x + randVelocity.g * (u_minMaxSpeed.y - u_minMaxSpeed.x));\n\n    float lifeTime = u_minMaxLifetime.x + randLifetime.r * (u_minMaxLifetime.y - u_minMaxLifetime.x);\n    out_ageAndLifetime = vec2(0.0, lifeTime);\n\n\n    float torque = u_minMaxTorque.x + randTorque.r * (u_minMaxTorque.y - u_minMaxTorque.x);\n    float rotation = u_minMaxRotation.x + randRotation.r * (u_minMaxRotation.y - u_minMaxRotation.x);\n    out_torqueAndRotation = vec2(torque, rotation);\n}\n\nvoid main() {\n\n    float elapsedTimeInSeconds = u_time.x;\n    float newAge = ageAndLifetime.x + elapsedTimeInSeconds;\n\n    if(newAge < ageAndLifetime.y) {\n        update(newAge, elapsedTimeInSeconds);\n    } else {\n        reset();\n    }\n}\n";
//# sourceMappingURL=particleUpdate.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/rect.vs.js":
/*!*********************************************!*\
  !*** ../renderer/lib/webgl/glsl/rect.vs.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec2 a_vertex;\nin float a_rotation;\nin vec2 a_position;\nin vec2 a_size;\nin vec4 a_color;\n\nuniform mat4 matrix_camera;\n\nout vec4 v_color;\n\nvoid main() {\n    float phi = a_rotation;\n\n    mat3 scale = mat3(\n        a_size.x, 0, 0,\n        0, a_size.y, 0,\n        0, 0, 1\n    );\n\n    mat3 rotate = mat3(\n        cos(phi), sin(phi), 0,\n        -sin(phi), cos(phi), 0,\n        0, 0, 1\n    );\n\n    mat3 translate = mat3(\n        1, 0, 0,\n        0, 1, 0,\n        a_position.x, a_position.y, 1\n    );\n\n    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(a_vertex.xy, 1), 1.0);\n\n    v_color = a_color;\n}\n";
//# sourceMappingURL=rect.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/sprite.vs.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/glsl/sprite.vs.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec2 a_vertex;\nin float a_rotation;\nin vec2 a_position;\nin vec2 a_size;\nin vec2 a_scale;\nin vec4 a_color;\nin vec2 a_texcoord;\nin vec2 a_texture_origin;\nin vec2 a_texture_size;\n\nuniform mat4 matrix_camera;\n\nout vec4 v_color;\nout vec2 v_texcoord;\nout vec2 v_texture_origin;\nout vec2 v_texture_size;\n\nvoid main() {\n    float phi = a_rotation;\n\n    mat3 scale = mat3(\n        a_size.x * a_scale.x, 0, 0,\n        0, a_size.y * a_scale.y, 0,\n        0, 0, 1\n    );\n\n    mat3 rotate = mat3(\n        cos(phi), sin(phi), 0,\n        -sin(phi), cos(phi), 0,\n        0, 0, 1\n    );\n\n    mat3 translate = mat3(\n        1, 0, 0,\n        0, 1, 0,\n        a_position.x, a_position.y, 1\n    );\n\n    gl_Position = matrix_camera * vec4(translate * rotate *  scale * vec3(a_vertex.xy, 1), 1.0);\n\n    v_color = a_color;\n    v_texture_origin = a_texture_origin;\n    v_texture_size = a_texture_size;\n    v_texcoord = a_texcoord;\n}\n";
//# sourceMappingURL=sprite.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/texture.fs.js":
/*!************************************************!*\
  !*** ../renderer/lib/webgl/glsl/texture.fs.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec4 v_color;\nin vec2 v_texcoord;\nin vec2 v_texture_origin;\nin vec2 v_texture_size;\n\nuniform sampler2D u_texture;\n\nout vec4 outColor;\n\n\nvoid main() {\n    vec4 color = texture(u_texture, v_texcoord * v_texture_size + v_texture_origin) * v_color;\n    if(color.a < 0.1) {\n        discard;\n    }\n    outColor = color;\n}\n";
//# sourceMappingURL=texture.fs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/glsl/triangle.vs.js":
/*!*************************************************!*\
  !*** ../renderer/lib/webgl/glsl/triangle.vs.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = "#version 300 es\nprecision highp float;\n\nin vec2 a_position;\nin vec4 a_color;\n\nuniform mat4 matrix_camera;\n\nout vec4 v_color;\n\nvoid main() {\n    // Multiply the position by the matrix.\n    gl_Position = matrix_camera * vec4(ceil(a_position), 1, 1);\n\n    // Copy the color from the attribute to the varying.\n    v_color = a_color;\n}\n";
//# sourceMappingURL=triangle.vs.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/Circle.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/shaders/Circle.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var circle_vs_1 = __webpack_require__(/*! ../glsl/circle.vs */ "../renderer/lib/webgl/glsl/circle.vs.js");
var circle_fs_1 = __webpack_require__(/*! ../glsl/circle.fs */ "../renderer/lib/webgl/glsl/circle.fs.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var RenderedCircle_1 = __webpack_require__(/*! ../../components/RenderedCircle */ "../renderer/lib/components/RenderedCircle.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var numVertices = 6;
var drawFunction = function (gl, elemNumber) {
    gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber);
};
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(gl) {
        var u = 0.5;
        return _super.call(this, gl, circle_vs_1.default, circle_fs_1.default, {
            attributes: {
                a_color: {
                    size: 4,
                    vertexAttribDivisor: 1,
                },
                a_fill: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
                a_position: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_rotation: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
                a_size: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_vertex: {
                    data: [
                        -u,
                        -u,
                        u,
                        -u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                },
                a_width: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
            },
            component: RenderedCircle_1.default,
            drawFunction: drawFunction,
        }) || this;
    }
    Circle.prototype.render = function (entity) {
        var _a = entity.get(RenderedCircle_1.default), offset = _a.offset, color = _a.color, radius = _a.radius, width = _a.width, fill = _a.fill;
        var _b = entity.get(core_1.Transform), position = _b.position, rotation = _b.rotation, size = _b.size;
        this.circle(math_1.Vec2.add(position, offset), radius ? math_1.Vec2.create(radius, radius) : size, {
            color: color,
            fill: fill,
            rotation: rotation,
            width: width !== null && width !== void 0 ? width : 1,
        });
    };
    Circle.prototype.circle = function (position, size, params) {
        this.pushVertex({
            a_color: params.color,
            a_fill: [params.fill ? 1 : 0],
            a_position: position.array(),
            a_rotation: [params.rotation],
            a_size: size.array(),
            a_width: [params.width],
        });
    };
    return Circle;
}(Shader_1.default));
exports["default"] = Circle;
//# sourceMappingURL=Circle.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/FillRect.js":
/*!*************************************************!*\
  !*** ../renderer/lib/webgl/shaders/FillRect.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var rect_vs_1 = __webpack_require__(/*! ../glsl/rect.vs */ "../renderer/lib/webgl/glsl/rect.vs.js");
var color_fs_1 = __webpack_require__(/*! ../glsl/color.fs */ "../renderer/lib/webgl/glsl/color.fs.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var FillRect_1 = __webpack_require__(/*! ../../components/FillRect */ "../renderer/lib/components/FillRect.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var numVertices = 6;
var drawFunction = function (gl, elemNumber) {
    gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber);
};
var FillRect = (function (_super) {
    __extends(FillRect, _super);
    function FillRect(gl) {
        var u = 0.5;
        return _super.call(this, gl, rect_vs_1.default, color_fs_1.default, {
            attributes: {
                a_color: {
                    size: 4,
                    vertexAttribDivisor: 1,
                },
                a_position: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_rotation: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
                a_size: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_vertex: {
                    data: [
                        -u,
                        -u,
                        u,
                        -u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                },
            },
            component: FillRect_1.default,
            drawFunction: drawFunction,
        }) || this;
    }
    FillRect.prototype.render = function (entity) {
        var _a = entity.get(FillRect_1.default), offset = _a.offset, color = _a.color, fillRectSize = _a.size;
        var _b = entity.get(core_1.Transform), position = _b.position, rotation = _b.rotation, size = _b.size;
        this.rect(math_1.Vec2.add(position, offset), fillRectSize !== null && fillRectSize !== void 0 ? fillRectSize : size, {
            color: color,
            rotation: rotation,
        });
    };
    FillRect.prototype.rect = function (position, size, params) {
        this.pushVertex({
            a_color: params.color,
            a_position: position.array(),
            a_rotation: [params.rotation],
            a_size: size.array(),
        });
    };
    return FillRect;
}(Shader_1.default));
exports["default"] = FillRect;
//# sourceMappingURL=FillRect.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/FillTriangle.js":
/*!*****************************************************!*\
  !*** ../renderer/lib/webgl/shaders/FillTriangle.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var triangle_vs_1 = __webpack_require__(/*! ../glsl/triangle.vs */ "../renderer/lib/webgl/glsl/triangle.vs.js");
var color_fs_1 = __webpack_require__(/*! ../glsl/color.fs */ "../renderer/lib/webgl/glsl/color.fs.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var FillTriangle = (function (_super) {
    __extends(FillTriangle, _super);
    function FillTriangle(gl) {
        return _super.call(this, gl, triangle_vs_1.default, color_fs_1.default, {
            attributes: {
                a_color: {
                    size: 4,
                },
                a_position: {
                    size: 2,
                },
            },
        }) || this;
    }
    FillTriangle.prototype.render = function () {
    };
    FillTriangle.prototype.drawTriangle = function (a, b, c, color) {
        this.pushVertex({
            a_color: color,
            a_position: [a.x, a.y],
        });
        this.pushVertex({
            a_color: color,
            a_position: [b.x, b.y],
        });
        this.pushVertex({
            a_color: color,
            a_position: [c.x, c.y],
        });
    };
    FillTriangle.prototype.fillPoly = function (position, points, params) {
        var _this = this;
        if (points.length < 3) {
            throw new Error('A polygon must have at least 3 points');
        }
        points.forEach(function (a, i) {
            var b = points[i + 2 > points.length ? 0 : i + 1];
            var ra = params.rotation ? a.rotate(params.rotation) : a;
            var rb = params.rotation ? b.rotate(params.rotation) : b;
            var pa = ra.add(position);
            var pb = rb.add(position);
            _this.drawTriangle(pa, pb, position, params.color);
        });
    };
    return FillTriangle;
}(Shader_1.default));
exports["default"] = FillTriangle;
//# sourceMappingURL=FillTriangle.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/Lines.js":
/*!**********************************************!*\
  !*** ../renderer/lib/webgl/shaders/Lines.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var line_vs_1 = __webpack_require__(/*! ../glsl/line.vs */ "../renderer/lib/webgl/glsl/line.vs.js");
var color_fs_1 = __webpack_require__(/*! ../glsl/color.fs */ "../renderer/lib/webgl/glsl/color.fs.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Lines = (function (_super) {
    __extends(Lines, _super);
    function Lines(gl) {
        return _super.call(this, gl, line_vs_1.default, color_fs_1.default, {
            attributes: {
                inLineEnd: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                inLineStart: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                inLineWidth: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
                lineColor: {
                    size: 4,
                    vertexAttribDivisor: 1,
                },
                vertexPos: {
                    data: [
                        -0.5, 0.5, 1.0, -0.5, -0.5, 1.0, 0.5, 0.5, 1.0, 0.5, -0.5, 1.0,
                    ],
                    isInstance: true,
                    size: 3,
                    usage: gl.STATIC_DRAW,
                },
            },
            drawFunction: function (glContext, elemNumber) {
                return glContext.drawArraysInstanced(glContext.TRIANGLE_STRIP, 0, 4, elemNumber);
            },
        }) || this;
    }
    Lines.prototype.rect = function (position, size, options) {
        var w2 = size.x / 2;
        var h2 = size.y / 2;
        this.poly(position, [
            new math_1.Vec2(+w2, +h2),
            new math_1.Vec2(-w2, +h2),
            new math_1.Vec2(-w2, -h2),
            new math_1.Vec2(+w2, -h2),
        ], options);
    };
    Lines.prototype.poly = function (position, points, options) {
        var _this = this;
        if (points.length < 3) {
            throw new Error('A polygon must have at least 3 points');
        }
        var lines = points.map(function (a, i) {
            var b = points[i + 2 > points.length ? 0 : i + 1];
            return [a, b];
        });
        if (options.diagonal) {
            lines.push([new math_1.Vec2(0, 0), points[0]]);
        }
        lines.forEach(function (_a) {
            var a = _a[0], b = _a[1];
            var ra = options.rotation ? a.rotate(options.rotation) : a;
            var rb = options.rotation ? b.rotate(options.rotation) : b;
            var pa = ra.add(position);
            var pb = rb.add(position);
            _this.line(pa, pb, {
                color: options.color,
                width: options.width,
            });
        });
    };
    Lines.prototype.line = function (start, end, options) {
        if (options.width < 0) {
            throw new Error('Width must be greater than zero');
        }
        this.pushVertex({
            inLineEnd: [end.x, end.y],
            inLineStart: [start.x, start.y],
            inLineWidth: [options.width],
            lineColor: options.color,
        });
    };
    return Lines;
}(Shader_1.default));
exports["default"] = Lines;
//# sourceMappingURL=Lines.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/ParticlesRender.js":
/*!********************************************************!*\
  !*** ../renderer/lib/webgl/shaders/ParticlesRender.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var particleRender_vs_1 = __webpack_require__(/*! ../glsl/particleRender.vs */ "../renderer/lib/webgl/glsl/particleRender.vs.js");
var particleRender_fs_1 = __webpack_require__(/*! ../glsl/particleRender.fs */ "../renderer/lib/webgl/glsl/particleRender.fs.js");
var ParticleEmitter_1 = __webpack_require__(/*! ../../components/ParticleEmitter */ "../renderer/lib/components/ParticleEmitter.js");
var ParticlesUpdate_1 = __webpack_require__(/*! ./ParticlesUpdate */ "../renderer/lib/webgl/shaders/ParticlesUpdate.js");
var particleAttributes_1 = __webpack_require__(/*! ./helpers/particleAttributes */ "../renderer/lib/webgl/shaders/helpers/particleAttributes.js");
var isParticleEmitterAlive_1 = __webpack_require__(/*! ./helpers/isParticleEmitterAlive */ "../renderer/lib/webgl/shaders/helpers/isParticleEmitterAlive.js");
var getParticleEmitterBuffers_1 = __webpack_require__(/*! ./helpers/getParticleEmitterBuffers */ "../renderer/lib/webgl/shaders/helpers/getParticleEmitterBuffers.js");
var ParticlesRender = (function (_super) {
    __extends(ParticlesRender, _super);
    function ParticlesRender(gl) {
        var u = 0.5;
        var attributes = Object.entries(particleAttributes_1.default).reduce(function (acc, _a) {
            var _b;
            var key = _a[0], attribute = _a[1];
            return __assign(__assign({}, acc), (attribute.render
                ? (_b = {}, _b[key] = __assign(__assign({}, attribute), { vertexAttribDivisor: 1 }), _b) : {}));
        }, {});
        return _super.call(this, gl, particleRender_vs_1.default, particleRender_fs_1.default, {
            attributes: __assign(__assign({}, attributes), { texcoord: {
                    data: [
                        0,
                        0,
                        1,
                        0,
                        0,
                        1,
                        1,
                        0,
                        1,
                        1,
                        0,
                        1,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                }, texture_origin: {
                    size: 2,
                    vertexAttribDivisor: 1,
                }, texture_size: {
                    size: 2,
                    vertexAttribDivisor: 1,
                }, vertex: {
                    data: [
                        -u,
                        -u,
                        u,
                        -u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                } }),
            component: ParticleEmitter_1.default,
            uniforms: [
                'u_startColor',
                'u_endColor',
                'u_texture',
                'u_minMaxSize',
            ],
        }) || this;
    }
    ParticlesRender.prototype.init = function (renderer) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var shaders, hasParticleUpdate;
            return __generator(this, function (_b) {
                shaders = (_a = renderer.shapes.get(ParticleEmitter_1.default)) !== null && _a !== void 0 ? _a : [];
                hasParticleUpdate = shaders.some(function (shader) { return shader instanceof ParticlesUpdate_1.default; });
                if (!hasParticleUpdate) {
                    throw new Error('ParticlesRender can be used only if ParticlesUpdate is enabled');
                }
                return [2];
            });
        });
    };
    ParticlesRender.prototype.flush = function () {
    };
    ParticlesRender.prototype.render = function (entity) {
        var _this = this;
        var _a, _b;
        var particleEmitter = entity.get(ParticleEmitter_1.default);
        if (!(0, isParticleEmitterAlive_1.default)(particleEmitter) || !particleEmitter.texture) {
            return;
        }
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);
        this.setUniform(Shader_1.DEFAULT_MATRIX_CAMERA_LOCATION, Shader_1.UniformType.M4, this.camera.projection);
        this.attributes.forEach(function (attribute, name) {
            if (name in particleAttributes_1.default) {
                var buffer1 = (0, getParticleEmitterBuffers_1.default)(particleEmitter, name).buffer1;
                _this.setBufferToAttribute(name, buffer1);
            }
        });
        (_a = this.attributes.get('vertex')) === null || _a === void 0 ? void 0 : _a.flush(this.gl);
        (_b = this.attributes.get('texcoord')) === null || _b === void 0 ? void 0 : _b.flush(this.gl);
        var totalNumber = Math.floor(particleEmitter.particleNumber);
        this.setBufferToAttribute('texture_origin', particleEmitter.textureOriginBuffer);
        this.setBufferToAttribute('texture_size', particleEmitter.textureSizeBuffer);
        this.setUniform('u_texture', Shader_1.UniformType.TEXTURE, particleEmitter.texture.webGLTexture);
        this.setUniform('u_startColor', Shader_1.UniformType.FV_4, particleEmitter.startColor);
        this.setUniform('u_endColor', Shader_1.UniformType.FV_4, particleEmitter.endColor);
        this.setUniform('u_minMaxSize', Shader_1.UniformType.FV_4, particleEmitter.minMaxSize);
        this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, totalNumber);
    };
    return ParticlesRender;
}(Shader_1.default));
exports["default"] = ParticlesRender;
//# sourceMappingURL=ParticlesRender.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/ParticlesUpdate.js":
/*!********************************************************!*\
  !*** ../renderer/lib/webgl/shaders/ParticlesUpdate.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
var particleUpdate_vs_1 = __webpack_require__(/*! ../glsl/particleUpdate.vs */ "../renderer/lib/webgl/glsl/particleUpdate.vs.js");
var particleUpdate_fs_1 = __webpack_require__(/*! ../glsl/particleUpdate.fs */ "../renderer/lib/webgl/glsl/particleUpdate.fs.js");
var particleAttributes_1 = __webpack_require__(/*! ./helpers/particleAttributes */ "../renderer/lib/webgl/shaders/helpers/particleAttributes.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var ParticleEmitter_1 = __webpack_require__(/*! ../../components/ParticleEmitter */ "../renderer/lib/components/ParticleEmitter.js");
var makeRandomTexture_1 = __webpack_require__(/*! ./helpers/makeRandomTexture */ "../renderer/lib/webgl/shaders/helpers/makeRandomTexture.js");
var makeTransformFeedback_1 = __webpack_require__(/*! ./helpers/makeTransformFeedback */ "../renderer/lib/webgl/shaders/helpers/makeTransformFeedback.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var isParticleEmitterAlive_1 = __webpack_require__(/*! ./helpers/isParticleEmitterAlive */ "../renderer/lib/webgl/shaders/helpers/isParticleEmitterAlive.js");
var makeBuffer_1 = __webpack_require__(/*! ./helpers/makeBuffer */ "../renderer/lib/webgl/shaders/helpers/makeBuffer.js");
var makeDefaultTexture_1 = __webpack_require__(/*! ./helpers/makeDefaultTexture */ "../renderer/lib/webgl/shaders/helpers/makeDefaultTexture.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var getParticleEmitterBuffers_1 = __webpack_require__(/*! ./helpers/getParticleEmitterBuffers */ "../renderer/lib/webgl/shaders/helpers/getParticleEmitterBuffers.js");
var initialData = (_a = {},
    _a[particleAttributes_1.ParticleAttributeName.AGE_AND_LIFETIME] = function (particleNumber) {
        return new Array(particleNumber)
            .fill(0)
            .map(function () { return [1, 0]; })
            .flat();
    },
    _a);
var ParticlesUpdate = (function (_super) {
    __extends(ParticlesUpdate, _super);
    function ParticlesUpdate(gl) {
        var _this = _super.call(this, gl, particleUpdate_vs_1.default, particleUpdate_fs_1.default, {
            attributes: particleAttributes_1.default,
            component: ParticleEmitter_1.default,
            maxElements: 0,
            transformFeedbackVaryings: Object.keys(particleAttributes_1.default).map(function (attribute) { return "out_".concat(attribute); }),
            uniforms: [
                'rgNoise',
                'u_time',
                'u_minMaxLifetime',
                'u_spawnPosition',
                'u_minMaxTheta',
                'u_minMaxSpeed',
                'u_minMaxTorque',
                'u_minMaxRotation',
                'u_gravity',
            ],
            withMatrixAttribute: false,
        }) || this;
        _this.randomTexture = (0, makeRandomTexture_1.default)(gl, 512, 512);
        _this.transformFeedback = (0, makeTransformFeedback_1.default)(gl);
        return _this;
    }
    ParticlesUpdate.prototype.initialData = function (name, particleNumber, size) {
        var fn = initialData[name];
        if (!fn) {
            return new Float32Array(particleNumber * size);
        }
        var data = fn(particleNumber, size);
        if (data.length !== particleNumber * size) {
            throw new Error("Wrong size for initialised data of attribute ".concat(name));
        }
        return new Float32Array(data);
    };
    ParticlesUpdate.prototype.flush = function () {
    };
    ParticlesUpdate.prototype.clean = function () {
    };
    ParticlesUpdate.prototype.updateParticleAge = function (entity, particleEmitter, elapsedTimeInSeconds) {
        var _a;
        particleEmitter.age += elapsedTimeInSeconds;
        if (!(0, isParticleEmitterAlive_1.default)(particleEmitter)) {
            (_a = particleEmitter.onEndOfLife) === null || _a === void 0 ? void 0 : _a.call(particleEmitter, entity);
            if (particleEmitter.deleteOnEndOfLife) {
                entity.destroy();
            }
        }
    };
    ParticlesUpdate.prototype.updateParticleNumber = function (particleEmitter, elapsedTimeInSeconds) {
        if (particleEmitter.particleNumber >= particleEmitter.maxParticleNumber) {
            return;
        }
        var lifetime = Math.max(particleEmitter.minMaxLifeTime.x, particleEmitter.minMaxLifeTime.y);
        var maxParticleNumber = particleEmitter.maxParticleNumber;
        var particlesToAdd = (maxParticleNumber / lifetime) *
            elapsedTimeInSeconds *
            particleEmitter.frequency;
        var particleNumber = particleEmitter.particleNumber + particlesToAdd;
        if (particleNumber < particleEmitter.maxParticleNumber) {
            particleEmitter.particleNumber = particleNumber;
        }
        else {
            particleEmitter.particleNumber = particleEmitter.maxParticleNumber;
        }
    };
    ParticlesUpdate.prototype.onEntityCreation = function (entity) {
        var _this = this;
        var particleEmitter = entity.get(ParticleEmitter_1.default);
        var textureOriginData = new Array(Math.floor(particleEmitter.maxParticleNumber))
            .fill(0)
            .map(function () { return particleEmitter.textureOriginFunction().array(); })
            .flat();
        var textureSizeData = new Array(Math.floor(particleEmitter.maxParticleNumber))
            .fill(0)
            .map(function () { return particleEmitter.textureSizeFunction().array(); })
            .flat();
        particleEmitter.age = 0;
        particleEmitter.textureOriginBuffer = (0, makeBuffer_1.default)(this.gl, new Float32Array(textureOriginData));
        particleEmitter.textureSizeBuffer = (0, makeBuffer_1.default)(this.gl, new Float32Array(textureSizeData));
        this.attributes.forEach(function (attribute, name) {
            var initialData = _this.initialData(name, particleEmitter.maxParticleNumber, attribute.size);
            var buffer1 = (0, makeBuffer_1.default)(_this.gl, initialData);
            var buffer2 = (0, makeBuffer_1.default)(_this.gl, initialData);
            particleEmitter.buffers.set(name, {
                buffer1: buffer1,
                buffer2: buffer2,
            });
        });
        if (!particleEmitter.texture) {
            particleEmitter.texture = (0, makeDefaultTexture_1.default)(this.gl);
        }
    };
    ParticlesUpdate.prototype.render = function (entity, camera, elapsedTimeInSeconds, totalTimeInSeconds) {
        var _this = this;
        var transform = entity.get(core_1.Transform);
        var particleEmitter = entity.get(ParticleEmitter_1.default);
        if (!(0, isParticleEmitterAlive_1.default)(particleEmitter)) {
            return;
        }
        this.updateParticleAge(entity, particleEmitter, elapsedTimeInSeconds);
        this.updateParticleNumber(particleEmitter, elapsedTimeInSeconds);
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);
        this.setUniform('rgNoise', Shader_1.UniformType.TEXTURE, this.randomTexture);
        this.setUniform('u_time', Shader_1.UniformType.FV_2, [
            elapsedTimeInSeconds,
            totalTimeInSeconds * 1000,
        ]);
        this.setUniform('u_minMaxLifetime', Shader_1.UniformType.FV_2, particleEmitter.minMaxLifeTime.array());
        this.setUniform('u_gravity', Shader_1.UniformType.FV_2, particleEmitter.gravity.array());
        this.setUniform('u_minMaxTheta', Shader_1.UniformType.FV_2, particleEmitter.minMaxTheta
            .array()
            .map(function (t) { return t + transform.rotation; }));
        this.setUniform('u_minMaxSpeed', Shader_1.UniformType.FV_2, particleEmitter.minMaxSpeed.array());
        this.setUniform('u_minMaxRotation', Shader_1.UniformType.FV_2, particleEmitter.minMaxRotation.array());
        this.setUniform('u_minMaxTorque', Shader_1.UniformType.FV_2, particleEmitter.minMaxTorque.array());
        this.setUniform('u_spawnPosition', Shader_1.UniformType.FV_2, math_1.Vec2.add(transform.position, particleEmitter.offset).array());
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
        var index = 0;
        this.attributes.forEach(function (attribute, name) {
            var _a = (0, getParticleEmitterBuffers_1.default)(particleEmitter, name), buffer1 = _a.buffer1, buffer2 = _a.buffer2;
            _this.setBufferToAttribute(name, buffer1);
            _this.gl.bindBufferBase(_this.gl.TRANSFORM_FEEDBACK_BUFFER, index, buffer2);
            particleEmitter.buffers.set(name, {
                buffer1: buffer2,
                buffer2: buffer1,
            });
            index++;
        });
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.enable(this.gl.RASTERIZER_DISCARD);
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, this.transformFeedback);
        this.gl.beginTransformFeedback(this.gl.POINTS);
        this.gl.drawArrays(this.gl.POINTS, 0, Math.floor(particleEmitter.particleNumber));
        this.gl.endTransformFeedback();
        this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, null);
        this.gl.disable(this.gl.RASTERIZER_DISCARD);
    };
    return ParticlesUpdate;
}(Shader_1.default));
exports["default"] = ParticlesUpdate;
//# sourceMappingURL=ParticlesUpdate.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/Shader.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/shaders/Shader.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_MATRIX_CAMERA_LOCATION = exports.UniformType = void 0;
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Attribute_1 = __webpack_require__(/*! ../Attribute */ "../renderer/lib/webgl/Attribute.js");
var createGLProgram_1 = __webpack_require__(/*! ./helpers/createGLProgram */ "../renderer/lib/webgl/shaders/helpers/createGLProgram.js");
var makeVertexArray_1 = __webpack_require__(/*! ./helpers/makeVertexArray */ "../renderer/lib/webgl/shaders/helpers/makeVertexArray.js");
var UniformType;
(function (UniformType) {
    UniformType["TEXTURE"] = "uniform1i";
    UniformType["FV_2"] = "uniform2fv";
    UniformType["FV_4"] = "uniform4fv";
    UniformType["FV_8"] = "uniform4fv";
    UniformType["M4"] = "uniformMatrix4fv";
})(UniformType = exports.UniformType || (exports.UniformType = {}));
var defaultDrawFunction = function (gl, elemNumber) { return gl.drawArrays(gl.TRIANGLES, 0, elemNumber); };
exports.DEFAULT_MATRIX_CAMERA_LOCATION = 'matrix_camera';
var Shader = (function () {
    function Shader(gl, vertexShader, fragmentShader, options) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        this.attributes = new Map();
        this.uniforms = new Map();
        this.elemNumber = 0;
        this.gl = gl;
        this.component = options === null || options === void 0 ? void 0 : options.component;
        this.maxElements = (_a = options === null || options === void 0 ? void 0 : options.maxElements) !== null && _a !== void 0 ? _a : 10000;
        this.drawFunction = (_b = options === null || options === void 0 ? void 0 : options.drawFunction) !== null && _b !== void 0 ? _b : defaultDrawFunction;
        if (!vertexShader && !fragmentShader) {
            return;
        }
        this.program = (0, createGLProgram_1.default)(gl, vertexShader, fragmentShader, options === null || options === void 0 ? void 0 : options.transformFeedbackVaryings);
        this.vao = (0, makeVertexArray_1.default)(gl);
        this.use();
        var uniformNames = __spreadArray(__spreadArray([], (((_c = options === null || options === void 0 ? void 0 : options.withMatrixAttribute) !== null && _c !== void 0 ? _c : true)
            ? [exports.DEFAULT_MATRIX_CAMERA_LOCATION]
            : []), true), ((_d = options === null || options === void 0 ? void 0 : options.uniforms) !== null && _d !== void 0 ? _d : []), true);
        uniformNames.forEach(function (uniformName) {
            _this.uniforms.set(uniformName, _this.getUniformLocation(uniformName));
        });
        Object.entries((_e = options === null || options === void 0 ? void 0 : options.attributes) !== null && _e !== void 0 ? _e : {}).forEach(function (_a) {
            var name = _a[0], attributeOptions = _a[1];
            _this.attributes.set(name, new Attribute_1.default(gl, _this.program, name, __assign({ maxElements: _this.maxElements }, attributeOptions)));
        });
    }
    Shader.prototype.onEntityCreation = function (entity) {
    };
    Shader.prototype.init = function (renderer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2];
            });
        });
    };
    Shader.prototype.clear = function () {
    };
    Shader.prototype.preRender = function (camera) {
        this.camera = camera;
    };
    Shader.prototype.render = function (entity, camera, elapsedTimeInSeconds, totalTimeInSeconds) {
    };
    Shader.prototype.postRender = function (camera, elapsedTimeInSeconds, totalTimeInSeconds) {
        this.flush();
        this.clear();
    };
    Shader.prototype.getUniformLocation = function (uniformName) {
        var location = this.gl.getUniformLocation(this.program, uniformName);
        if (!location) {
            (0, core_1.throwError)("Could not get uniform location: ".concat(uniformName));
        }
        return location !== null && location !== void 0 ? location : 0;
    };
    Shader.prototype.pushVertex = function (vertex) {
        this.attributes.forEach(function (attribute, name) {
            if (attribute.isInstance) {
                return;
            }
            if (!(name in vertex)) {
                throw new Error("missing attribute: ".concat(name));
            }
            attribute.pushData(vertex[name]);
        });
        this.elemNumber++;
        if (this.elemNumber >= this.maxElements) {
            this.flush();
        }
    };
    Shader.prototype.pushMultiVertex = function (vertex) {
        this.attributes.forEach(function (attribute, name) {
            if (attribute.isInstance) {
                return;
            }
            if (!(name in vertex)) {
                throw new Error("missing attribute: ".concat(name));
            }
            attribute.pushManyData(vertex[name]);
        });
    };
    Shader.prototype.flush = function () {
        var _this = this;
        if (!this.shouldDraw()) {
            return;
        }
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);
        this.setUniform(exports.DEFAULT_MATRIX_CAMERA_LOCATION, UniformType.M4, this.camera.projection);
        this.attributes.forEach(function (attribute) { return attribute.enable(_this.gl); });
        this.attributes.forEach(function (attribute) { return attribute.bindData(_this.gl); });
        this.attributes.forEach(function (attribute) { return attribute.pointer(_this.gl); });
        this.beforeDraw();
        this.drawFunction(this.gl, this.elemNumber);
        this.elemNumber = 0;
    };
    Shader.prototype.beforeDraw = function () {
    };
    Shader.prototype.setBufferToAttribute = function (name, value) {
        var attribute = this.attributes.get(name);
        if (!attribute) {
            (0, core_1.log)("Attribute not found: ".concat(name), 'red');
            return;
        }
        attribute.enable(this.gl);
        attribute.pointer(this.gl, value);
    };
    Shader.prototype.setUniform = function (name, type, value) {
        if (!value) {
            return;
        }
        var location = this.uniforms.get(name);
        if (!location) {
            (0, core_1.log)("Location not found: ".concat(name), 'red');
            return;
        }
        switch (type) {
            case UniformType.TEXTURE: {
                this.gl.bindTexture(this.gl.TEXTURE_2D, value);
                this.gl.uniform1i(location, value);
                break;
            }
            case UniformType.M4: {
                this.gl.uniformMatrix4fv(location, false, value);
                break;
            }
            default: {
                this.gl[type](location, value);
            }
        }
    };
    Shader.prototype.shouldDraw = function () {
        return !!this.elemNumber;
    };
    Shader.prototype.use = function () {
        this.gl.useProgram(this.program);
    };
    return Shader;
}());
exports["default"] = Shader;
//# sourceMappingURL=Shader.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/Sprite.js":
/*!***********************************************!*\
  !*** ../renderer/lib/webgl/shaders/Sprite.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var sprite_vs_1 = __webpack_require__(/*! ../glsl/sprite.vs */ "../renderer/lib/webgl/glsl/sprite.vs.js");
var texture_fs_1 = __webpack_require__(/*! ../glsl/texture.fs */ "../renderer/lib/webgl/glsl/texture.fs.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var Sprite_1 = __webpack_require__(/*! ../../components/Sprite */ "../renderer/lib/components/Sprite.js");
var Color_1 = __webpack_require__(/*! ../../color/Color */ "../renderer/lib/color/Color.js");
var numVertices = 6;
var drawFunction = function (gl, elemNumber) {
    gl.drawArraysInstanced(gl.TRIANGLES, 0, numVertices, elemNumber);
};
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(gl, component) {
        var u = 0.5;
        return _super.call(this, gl, sprite_vs_1.default, texture_fs_1.default, {
            attributes: {
                a_color: {
                    size: 4,
                    vertexAttribDivisor: 1,
                },
                a_position: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_rotation: {
                    size: 1,
                    vertexAttribDivisor: 1,
                },
                a_scale: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_size: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_texcoord: {
                    data: [
                        0,
                        0,
                        1,
                        0,
                        0,
                        1,
                        1,
                        0,
                        1,
                        1,
                        0,
                        1,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                },
                a_texture_origin: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_texture_size: {
                    size: 2,
                    vertexAttribDivisor: 1,
                },
                a_vertex: {
                    data: [
                        -u,
                        -u,
                        u,
                        -u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                        u,
                        -u,
                        u,
                    ],
                    isInstance: true,
                    size: 2,
                    usage: gl.STATIC_DRAW,
                },
            },
            component: component !== null && component !== void 0 ? component : Sprite_1.default,
            drawFunction: drawFunction,
            uniforms: ['u_texture'],
        }) || this;
    }
    Sprite.prototype.render = function (entity) {
        var _a;
        var _b = entity.get(Sprite_1.default), texture = _b.texture, textureSize = _b.size, origin = _b.origin, scale = _b.scale;
        if (texture.webGLTexture !== ((_a = this.currentTexture) === null || _a === void 0 ? void 0 : _a.webGLTexture)) {
            this.flush();
            this.currentTexture = texture;
        }
        var _c = entity.get(core_1.Transform), position = _c.position, size = _c.size, rotation = _c.rotation;
        var color = Color_1.colorWhite;
        this.pushVertex({
            a_color: color,
            a_position: position.array(),
            a_rotation: [rotation],
            a_scale: scale.array(),
            a_size: size.array(),
            a_texture_origin: origin.array(),
            a_texture_size: textureSize.array(),
        });
    };
    Sprite.prototype.beforeDraw = function () {
        this.setUniform('u_texture', Shader_1.UniformType.TEXTURE, this.currentTexture.webGLTexture);
    };
    Sprite.prototype.shouldDraw = function () {
        return this.elemNumber > 0 && this.currentTexture !== null;
    };
    return Sprite;
}(Shader_1.default));
exports["default"] = Sprite;
//# sourceMappingURL=Sprite.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/Text.js":
/*!*********************************************!*\
  !*** ../renderer/lib/webgl/shaders/Text.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Sprite_1 = __webpack_require__(/*! ./Sprite */ "../renderer/lib/webgl/shaders/Sprite.js");
var RenderedText_1 = __webpack_require__(/*! ../../components/RenderedText */ "../renderer/lib/components/RenderedText.js");
var generateFontTexture_1 = __webpack_require__(/*! ./helpers/generateFontTexture */ "../renderer/lib/webgl/shaders/helpers/generateFontTexture.js");
var core_1 = __webpack_require__(/*! @mythor/core */ "../core/lib/core.js");
var math_1 = __webpack_require__(/*! @mythor/math */ "../math/lib/math.js");
var Color_1 = __webpack_require__(/*! ../../color/Color */ "../renderer/lib/color/Color.js");
var Shader_1 = __webpack_require__(/*! ./Shader */ "../renderer/lib/webgl/shaders/Shader.js");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(gl) {
        return _super.call(this, gl, RenderedText_1.default) || this;
    }
    Text.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.currentFont) {
                            return [2];
                        }
                        _a = this;
                        return [4, (0, generateFontTexture_1.default)(this.gl)];
                    case 1:
                        _a.currentFont = _b.sent();
                        return [2];
                }
            });
        });
    };
    Text.prototype.render = function (entity) {
        if (!entity.has(RenderedText_1.default)) {
            return;
        }
        var text = entity.get(RenderedText_1.default);
        var position = entity.get(core_1.Transform).position;
        this.text(position.add(text.offset), text.str, {
            color: text.color,
            font: text.font,
        });
    };
    Text.prototype.text = function (position, text, options) {
        var _a, _b, _c;
        var size = (_a = options === null || options === void 0 ? void 0 : options.size) !== null && _a !== void 0 ? _a : 1;
        var font = (_b = options === null || options === void 0 ? void 0 : options.font) !== null && _b !== void 0 ? _b : this.currentFont;
        if (!font) {
            throw new Error('Could not draw text without font');
        }
        var color = (_c = options === null || options === void 0 ? void 0 : options.color) !== null && _c !== void 0 ? _c : Color_1.colorWhite;
        var currentPosition = math_1.Vec2.create(position.x, position.y);
        for (var i = 0; i < text.length; ++i) {
            var letter = text[i];
            if (letter === '\n') {
                currentPosition.x = position.x;
                currentPosition.y += font.letterHeight * font.scale * size;
                continue;
            }
            var glyphInfo = font.getGlyph(letter);
            if (!glyphInfo) {
                currentPosition.x += font.spaceWidth * font.scale * size;
                continue;
            }
            this.drawLetter(letter, currentPosition, { color: color, font: font, size: size });
            currentPosition.x += (glyphInfo.width + font.spacing) * font.scale * size;
        }
    };
    Text.prototype.lineHeight = function () {
        if (!this.currentFont) {
            return 0;
        }
        return this.currentFont.scale * this.currentFont.letterHeight;
    };
    Text.prototype.drawLetter = function (letter, position, _a) {
        var _b, _c, _d;
        var color = _a.color, font = _a.font, _e = _a.size, size = _e === void 0 ? 1 : _e;
        if (((_c = (_b = this.currentFont) === null || _b === void 0 ? void 0 : _b.texture) === null || _c === void 0 ? void 0 : _c.webGLTexture) !== ((_d = font.texture) === null || _d === void 0 ? void 0 : _d.webGLTexture)) {
            this.flush();
            this.currentFont = font;
        }
        var glyphInfo = font.getGlyph(letter);
        if (!glyphInfo || !font.texture) {
            return;
        }
        var maxX = font.texture.size.x;
        this.pushVertex({
            a_color: color,
            a_position: position.array(),
            a_rotation: [0],
            a_scale: [font.scale, font.scale],
            a_size: [glyphInfo.width * size, font.letterHeight * size],
            a_texture_origin: [glyphInfo.x / maxX, 0],
            a_texture_size: [glyphInfo.width / maxX, 1],
        });
    };
    Text.prototype.beforeDraw = function () {
        var _a, _b;
        this.setUniform('u_texture', Shader_1.UniformType.TEXTURE, (_b = (_a = this.currentFont) === null || _a === void 0 ? void 0 : _a.texture) === null || _b === void 0 ? void 0 : _b.webGLTexture);
    };
    Text.prototype.shouldDraw = function () {
        var _a;
        return this.elemNumber > 0 && ((_a = this.currentFont) === null || _a === void 0 ? void 0 : _a.texture) !== null;
    };
    return Text;
}(Sprite_1.default));
exports["default"] = Text;
//# sourceMappingURL=Text.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/createGLProgram.js":
/*!****************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/createGLProgram.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var createShader_1 = __webpack_require__(/*! ./createShader */ "../renderer/lib/webgl/shaders/helpers/createShader.js");
function createGLProgram(gl, vertexShader, fragmentShader, transformFeedbackVaryings) {
    var program = gl.createProgram();
    if (!program) {
        throw new Error('Could not create program');
    }
    gl.attachShader(program, (0, createShader_1.default)(gl, vertexShader, gl.VERTEX_SHADER));
    gl.attachShader(program, (0, createShader_1.default)(gl, fragmentShader, gl.FRAGMENT_SHADER));
    if (transformFeedbackVaryings) {
        gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
    }
    gl.linkProgram(program);
    var linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkStatus) {
        var errorMessage = gl.getProgramInfoLog(program);
        throw new Error("Could not link program.\n".concat(errorMessage !== null && errorMessage !== void 0 ? errorMessage : 'unknown'));
    }
    return program;
}
exports["default"] = createGLProgram;
//# sourceMappingURL=createGLProgram.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/createShader.js":
/*!*************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/createShader.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function createShader(gl, shaderSource, type) {
    var shader = gl.createShader(type);
    if (!shader) {
        throw new Error('could not create shader');
    }
    var i = 0;
    while (/\s/.test(shaderSource[i]))
        i++;
    shaderSource = shaderSource.slice(i);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compileStatus) {
        var errorMessage = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Could not compile shader:\n".concat(errorMessage !== null && errorMessage !== void 0 ? errorMessage : 'unknown'));
    }
    return shader;
}
exports["default"] = createShader;
//# sourceMappingURL=createShader.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/generateFontTexture.js":
/*!********************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/generateFontTexture.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var TextureManager_1 = __webpack_require__(/*! ../../../managers/TextureManager */ "../renderer/lib/managers/TextureManager.js");
var Font_1 = __webpack_require__(/*! ../../../objects/Font */ "../renderer/lib/objects/Font.js");
var generateChars = function () {
    var startAscii = 33;
    var endAscii = 255;
    var allCharCodes = [];
    for (var i = startAscii; i <= endAscii; i++) {
        allCharCodes.push(i);
    }
    return String.fromCharCode.apply(String, allCharCodes);
};
function generateFontTexture(gl, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.fontName, fontName = _c === void 0 ? 'monospace' : _c, _d = _b.fontSize, fontSize = _d === void 0 ? 100 : _d, _e = _b.fontScale, fontScale = _e === void 0 ? 0.2 : _e;
    return __awaiter(this, void 0, void 0, function () {
        var canvas, textCtx, text, width, height, size, x, i, glyphs, char, charSize, url;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    canvas = document.createElement('canvas');
                    textCtx = canvas.getContext('2d');
                    text = generateChars();
                    width = fontSize * text.length;
                    height = fontSize;
                    if (!textCtx) {
                        throw new Error('Could not get context');
                    }
                    textCtx.canvas.width = width;
                    textCtx.canvas.height = height;
                    textCtx.font = "".concat(fontSize, "px ").concat(fontName);
                    textCtx.textAlign = 'left';
                    textCtx.textBaseline = 'top';
                    textCtx.fillStyle = 'white';
                    size = textCtx.measureText(text);
                    textCtx.canvas.width = size.width;
                    textCtx.font = "".concat(fontSize, "px monospace");
                    textCtx.textAlign = 'left';
                    textCtx.textBaseline = 'top';
                    textCtx.fillStyle = 'white';
                    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
                    x = 0;
                    i = 0;
                    glyphs = {};
                    while (i < text.length) {
                        char = text.charAt(i);
                        charSize = Math.round(textCtx.measureText(char).width);
                        glyphs[char] = { width: charSize, x: x, y: 0 };
                        textCtx.fillText(char, x, 0);
                        x += charSize;
                        i++;
                    }
                    url = canvas.toDataURL('image/png');
                    return [4, (0, TextureManager_1.loadTexture)('defaultFont', url, gl, { log: false }).then(function (texture) {
                            return new Font_1.default(texture, {
                                glyphs: glyphs,
                                letterHeight: fontSize,
                                scale: fontScale,
                                spaceWidth: fontSize,
                            });
                        })];
                case 1: return [2, _f.sent()];
            }
        });
    });
}
exports["default"] = generateFontTexture;
//# sourceMappingURL=generateFontTexture.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/getParticleEmitterBuffers.js":
/*!**************************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/getParticleEmitterBuffers.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var getParticleEmitterBuffers = function (particleEmitter, name) {
    var buffers = particleEmitter.buffers.get(name);
    if (!buffers) {
        throw new Error("buffers for attribute ".concat(name, " not found in particleEmitter"));
    }
    return buffers;
};
exports["default"] = getParticleEmitterBuffers;
//# sourceMappingURL=getParticleEmitterBuffers.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/isParticleEmitterAlive.js":
/*!***********************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/isParticleEmitterAlive.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var isParticleEmitterAlive = function (particleEmitter) {
    if (particleEmitter.respawn) {
        return true;
    }
    return particleEmitter.age < particleEmitter.minMaxLifeTime.y;
};
exports["default"] = isParticleEmitterAlive;
//# sourceMappingURL=isParticleEmitterAlive.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/makeBuffer.js":
/*!***********************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/makeBuffer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function makeBuffer(gl, sizeOrData, usage) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error('could not create buffer');
    }
    if (sizeOrData) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage !== null && usage !== void 0 ? usage : gl.DYNAMIC_DRAW);
    }
    return buffer;
}
exports["default"] = makeBuffer;
//# sourceMappingURL=makeBuffer.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/makeDefaultTexture.js":
/*!*******************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/makeDefaultTexture.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Texture_1 = __webpack_require__(/*! ../../../objects/Texture */ "../renderer/lib/objects/Texture.js");
var makeDefaultTexture = function (gl, resolution) {
    if (resolution === void 0) { resolution = 20; }
    var r1 = 0;
    var r2 = 8;
    var c = (r2 + 1) * resolution;
    r1 *= resolution;
    r2 *= resolution;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    if (!context) {
        throw new Error('could not create context');
    }
    canvas.width = canvas.height = c * 2;
    var gradient = context.createRadialGradient(c, c, r1, c, c, r2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new Texture_1.default(canvas, gl);
};
exports["default"] = makeDefaultTexture;
//# sourceMappingURL=makeDefaultTexture.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/makeRandomTexture.js":
/*!******************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/makeRandomTexture.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var randomRGData = function (sizeX, sizeY) {
    var d = [];
    for (var i = 0; i < sizeX * sizeY; ++i) {
        d.push(Math.random() * 255.0);
        d.push(Math.random() * 255.0);
    }
    return new Uint8Array(d);
};
var makeRandomTexture = function (gl, width, height) {
    var randomTexture = gl.createTexture();
    if (!randomTexture) {
        throw new Error('Could not create texture');
    }
    gl.bindTexture(gl.TEXTURE_2D, randomTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG8, width, height, 0, gl.RG, gl.UNSIGNED_BYTE, randomRGData(width, height));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return randomTexture;
};
exports["default"] = makeRandomTexture;
//# sourceMappingURL=makeRandomTexture.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/makeTransformFeedback.js":
/*!**********************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/makeTransformFeedback.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var makeTransformFeedback = function (gl) {
    var transformFeedback = gl.createTransformFeedback();
    if (!transformFeedback) {
        throw new Error('Could not create transform feedback');
    }
    return transformFeedback;
};
exports["default"] = makeTransformFeedback;
//# sourceMappingURL=makeTransformFeedback.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/makeVertexArray.js":
/*!****************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/makeVertexArray.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function makeVertexArray(gl, bufLocPairs) {
    var vao = gl.createVertexArray();
    if (!vao) {
        throw new Error('could not create vao');
    }
    gl.bindVertexArray(vao);
    if (bufLocPairs) {
        for (var _i = 0, bufLocPairs_1 = bufLocPairs; _i < bufLocPairs_1.length; _i++) {
            var _a = bufLocPairs_1[_i], buffer = _a[0], location_1 = _a[1];
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(location_1);
            gl.vertexAttribPointer(location_1, 2, gl.FLOAT, false, 0, 0);
        }
    }
    return vao;
}
exports["default"] = makeVertexArray;
//# sourceMappingURL=makeVertexArray.js.map

/***/ }),

/***/ "../renderer/lib/webgl/shaders/helpers/particleAttributes.js":
/*!*******************************************************************!*\
  !*** ../renderer/lib/webgl/shaders/helpers/particleAttributes.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParticleAttributeName = void 0;
var ParticleAttributeName;
(function (ParticleAttributeName) {
    ParticleAttributeName["AGE_AND_LIFETIME"] = "ageAndLifetime";
    ParticleAttributeName["POSITION"] = "position";
    ParticleAttributeName["TORQUE_AND_ROTATION"] = "torqueAndRotation";
})(ParticleAttributeName = exports.ParticleAttributeName || (exports.ParticleAttributeName = {}));
var particleAttributes = (_a = {},
    _a[ParticleAttributeName.AGE_AND_LIFETIME] = {
        render: true,
        size: 2,
    },
    _a[ParticleAttributeName.POSITION] = {
        render: true,
        size: 2,
    },
    _a[ParticleAttributeName.TORQUE_AND_ROTATION] = {
        render: true,
        size: 2,
    },
    _a.velocity = {
        size: 2,
    },
    _a);
exports["default"] = particleAttributes;
//# sourceMappingURL=particleAttributes.js.map

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/examples/scene.ts"));
/******/ }
]);
//# sourceMappingURL=scene.js.map