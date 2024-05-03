import { system, world } from "@minecraft/server";

system.runInterval(() => {
    const dimensionIds = ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"];

    try {
        for (const dimensionId of dimensionIds) {
            const entities = world.getDimension(dimensionId).getEntities();
            
            ForEntity: for (const entity of entities) {
                if (!entity.getComponent("minecraft:scale")) continue;
                if (!entity.scaleTags) entity.scaleTags = {
                    old: [],
                    new: []
                };
                if (entity.scaleTags.new.length > 0) {
                    entity.scaleTags.old = entity.scaleTags.new;
                }
    
                entity.scaleTags.new = entity.getTags();
    
                const addedElements = entity.scaleTags.new.filter(item => !entity.scaleTags.old.includes(item));
    
                for (const addedElement of addedElements) {
                    if (addedElement.startsWith("scale_")) {
                        for (const tag of entity.getTags()) {
                            if (tag === addedElement) continue;
                            entity.removeTag(tag);
                        }
                    }
                }
    
                for (const tag of entity.getTags()) {
                    if (tag.startsWith("scale_")) {
                        try {
                            const scale = parseFloat(tag.replace("scale_", ""));
                            entity.getComponent("minecraft:scale").value = scale;
                        } catch {}
    
                        continue ForEntity;
                    }
                }
    
                entity.getComponent("minecraft:scale").value = 1;
            }
        }
    } catch {}
});