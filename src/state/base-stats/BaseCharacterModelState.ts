import { UpdateAbilityScore } from '../actions/UpdateAbilityScore';
import { State, StateContext, Selector, Action } from '@ngxs/store';
import { BaseStats } from './BaseStatsModel';
import { AbilityScoreBase } from './AbilityScoreBase';
import { AbilityScore } from './AbilityScore';
import { ResetStateModelAction } from '../actions/ResetStateModelAction';
import { AbilitySavingThrow } from './AbilitySavingThrow';
import { UpdateInspirationAction } from '../actions/UpdateInspirationAction';
import { UpdateCharacterLevelAction } from '../actions/UpdateCharacterLevelAction';
import { SkillModel } from '../skills/SkillsModel';
import { Skills } from '../skills/Skills';
import { SkillProficiencyBonus } from './SkillProficiencyBonus';
import { UpdateSkillModelAction } from '../actions/UpdateSkillModelAction';
import { UpdateCharacterAlignmentAction } from '../actions/UpdateCharacterAlignmentAction';
import { HealthInfoInterface } from './HealthInfoInterface';
import { UpdateDamageTakenAction } from '../actions/UpdateDamageTakenAction';
import { UpdateTemporaryHitPointsAction } from '../actions/UpdateTemporaryHitPointsAction';
import { UpdateHealthAction } from '../actions/UpdateHealthAction';
import { UpdateAbilitySavingThrowAction } from '../actions/UpdateAbilitySavingThrow';

export class BaseCharacterModel {
    baseStats: BaseStats = new BaseStats();
    loggedInUser: string = "Test username for it needs a class later";
    savingThrows: Array<AbilitySavingThrow>;
    skills: Array<SkillModel>;
}

@State<BaseCharacterModel>({
    name: 'BaseCharacterModelState',
    defaults: {
        baseStats: new BaseStats(),
        loggedInUser: "Test username for it needs a class later",
        savingThrows: [],
        skills: [],
    }
})
export class BaseCharacterModelState {

    @Selector()
    static getAllState(state: BaseCharacterModel) {
        return state;
    }

    @Selector()
    static getAbilityScores(state: BaseCharacterModel) {
        let s = new AbilityScoreBase();
        s.charisma = state.baseStats.charisma;
        s.constitution = state.baseStats.constitution;
        s.dexterity = state.baseStats.dexterity;
        s.intelligence = state.baseStats.intelligence;
        s.strength = state.baseStats.strength;
        s.wisdom = state.baseStats.wisdom;
        return s;
    }

    @Selector()
    static getProficiencyBonus(state: BaseCharacterModel) {
        return state.baseStats.proficiencyBonus;
    }

    @Selector()
    static getBaseStats(state: BaseCharacterModel) {
        return state.baseStats;
    }

    @Selector()
    static getPlayerName(state: BaseCharacterModel) {
        return state.loggedInUser;
    }

    @Selector()
    static getSkills(state: BaseCharacterModel) {
        if (state.skills === undefined || state.skills.length === 0) {
            let skills: SkillModel[] = [];
            let proficiency = state.baseStats.proficiencyBonus;
            skills.push(new SkillModel(Skills.acrobatics, state.baseStats.dexterity, proficiency, SkillProficiencyBonus.none));
            skills.push(new SkillModel(Skills.animalHandling, state.baseStats.wisdom, proficiency, SkillProficiencyBonus.half));
            skills.push(new SkillModel(Skills.arcana, state.baseStats.intelligence, proficiency, SkillProficiencyBonus.checked));
            skills.push(new SkillModel(Skills.athletics, state.baseStats.dexterity, proficiency, SkillProficiencyBonus.expertice));
            skills.push(new SkillModel(Skills.deception, state.baseStats.charisma, proficiency));
            skills.push(new SkillModel(Skills.history, state.baseStats.intelligence, proficiency));
            skills.push(new SkillModel(Skills.insight, state.baseStats.wisdom, proficiency));
            skills.push(new SkillModel(Skills.intimidation, state.baseStats.charisma, proficiency));
            skills.push(new SkillModel(Skills.investigation, state.baseStats.intelligence, proficiency));
            skills.push(new SkillModel(Skills.medicine, state.baseStats.wisdom, proficiency));
            skills.push(new SkillModel(Skills.nature, state.baseStats.intelligence, proficiency));
            skills.push(new SkillModel(Skills.perception, state.baseStats.wisdom, proficiency));
            skills.push(new SkillModel(Skills.performance, state.baseStats.charisma, proficiency));
            skills.push(new SkillModel(Skills.persuasion, state.baseStats.charisma, proficiency));
            skills.push(new SkillModel(Skills.religion, state.baseStats.intelligence, proficiency));
            skills.push(new SkillModel(Skills.sleightOfHand, state.baseStats.dexterity, proficiency));
            skills.push(new SkillModel(Skills.stealth, state.baseStats.dexterity, proficiency));
            skills.push(new SkillModel(Skills.survival, state.baseStats.wisdom, proficiency));
            state.skills = skills;
        }
        return state.skills;
    }

    @Selector()
    static getSavingThrows(state: BaseCharacterModel) {
        if(state.savingThrows === undefined || state.savingThrows.length === 0) {
            let savingThrows = [];
            let proficiency = state.baseStats.proficiencyBonus;
            savingThrows.push(new AbilitySavingThrow(state.baseStats.strength, proficiency, SkillProficiencyBonus.half));
            savingThrows.push(new AbilitySavingThrow(state.baseStats.dexterity, proficiency, SkillProficiencyBonus.checked));
            savingThrows.push(new AbilitySavingThrow(state.baseStats.constitution, proficiency, SkillProficiencyBonus.expertice));
            savingThrows.push(new AbilitySavingThrow(state.baseStats.intelligence, proficiency));
            savingThrows.push(new AbilitySavingThrow(state.baseStats.wisdom, proficiency));
            savingThrows.push(new AbilitySavingThrow(state.baseStats.charisma, proficiency));
            state.savingThrows = savingThrows;
        }
        return state.savingThrows;
    }

    @Selector()
    static getHealthInfo(state: BaseCharacterModel) {
        return state.baseStats as HealthInfoInterface;
    }

    @Action(UpdateAbilityScore)
    updateAbilityScore(context: StateContext<BaseCharacterModel>, { payload }: UpdateAbilityScore) {
        let state = context.getState();
        let ability = state.baseStats[payload.name] as AbilityScore;
        ability.stat = payload.stat;
        state.baseStats[payload.name] = ability;
        context.setState(state);
    }

    @Action(ResetStateModelAction)
    resetStateModelAction(context: StateContext<BaseCharacterModel>) {
        let state = context.getState();
        state = new BaseCharacterModel();
        context.setState(state);
    }

    @Action(UpdateInspirationAction)
    updateInspirationAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateInspirationAction) {
        let state = context.getState();
        state.baseStats.inspiration = payload;
        context.setState(state);
    }

    @Action(UpdateCharacterLevelAction)
    updateCharacterLevelAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateCharacterLevelAction) {
        let state = context.getState();
        state.baseStats.level = payload;
        context.setState(state);
    }

    @Action(UpdateSkillModelAction)
    updateSkillModelAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateSkillModelAction) {
        let state = context.getState();
        state.skills[payload.name] = payload;
        context.setState(state);
    }

    @Action(UpdateCharacterAlignmentAction)
    updateCharacterAlignmentAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateCharacterAlignmentAction) {
        let state = context.getState();
        state.baseStats.characterAlignment = payload;
        context.setState(state);
    }

    @Action(UpdateDamageTakenAction)
    updateDamageTakenAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateDamageTakenAction) {
        let state = context.getState();
        state.baseStats.damagedHitPoints = payload;
        context.setState(state);
    }

    @Action(UpdateTemporaryHitPointsAction)
    updateTemporaryHitPointsAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateTemporaryHitPointsAction) {
        let state = context.getState();
        state.baseStats.tempHitPoints = payload;
        context.setState(state);
    }

    @Action(UpdateHealthAction)
    updateHealthAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateHealthAction) {
        let state = context.getState();
        state.baseStats.setHitPoints(payload.value, payload.fullHeal);
        context.setState(state);
    }

    @Action(UpdateAbilitySavingThrowAction)
    updateAbilitySavingThrowAction(context: StateContext<BaseCharacterModel>, { payload }: UpdateAbilitySavingThrowAction) {
        let state = context.getState();
        let abilityIndex = state.savingThrows.findIndex(x => x.ability.name === payload.ability.name);
        state.savingThrows[abilityIndex] = payload;
        context.setState(state);
    }
}
