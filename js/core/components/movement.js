export function addDashing(entity, dashPower = 30) {
    if (!entity.components.powers) {
        entity.components.powers = {}
    }

    if (entity.components.powers.dash) return;

    entity.components.powers.dash = {
        isDashing: false,
        dashPower: dashPower,
        distanceTravelled: 0,
        onCoolDown: false
    }
}

export function addSpeed(entity, EntitySpeed = 50) {
    if (!entity.components.powers) {
        entity.components.powers = {}
    }

    if (entity.components.powers.speed) return;
    entity.components.powers.speed = {
        speed: EntitySpeed
    }
} 

export function addJump(entity, jumpPow) {
    if(!entity.components.powers) {
        entity.components.powers = {}
    }

    if(entity.components.powers.jump) return;

    entity.components.powers.jump = {
        jumpPower: jumpPow,
        // isJumping: false
    }
}