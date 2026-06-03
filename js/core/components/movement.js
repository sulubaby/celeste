export function addDashing(entity, dashPower = 30) {
    if(!entity.components.powers) {
        entity.components.powers = {}
    }

    if(entity.components.powers.dash) return;

    entity.components.powers.dash = {
        isDashing: false,
        dashPower: dashPower,
        distanceTravelled: 0
    }
}